import { LinkCSService } from 'src/viarezo/linkcs.service';
import { Access, AccessType } from './access';
import { AllAccess } from './all-access';
import { AssoAccess } from './asso-access';
import { CotizAccess } from './cotiz-access';
import { CSAccess } from './cs-access';
import { PromoAccess } from './promo-access';
import { CotizService } from 'src/viarezo/cotiz.service';

type Expression =
  | {
      function:
        | AccessType.ALL
        | AccessType.ASSO
        | AccessType.COTIZ
        | AccessType.CS
        | AccessType.PROMO;
      meta?: string;
    }
  | {
      type: 'and' | 'or';
      expressions: Expression[];
    }
  | {
      type: 'not';
      expression: Expression;
    };

export class AdvancedAccess extends Access {
  private readonly functions;

  constructor(linkcsService: LinkCSService, cotizService: CotizService) {
    super();

    this.functions = {
      ALL: new AllAccess(),
      PROMO: new PromoAccess(),
      ASSO: new AssoAccess(linkcsService),
      COTIZ: new CotizAccess(cotizService),
      CS: new CSAccess(),
    };
  }

  public async authorize(request: any, meta: string) {
    const expression = this.parseExpression(meta);

    return await this.evaluateExpression(expression, request);
  }

  public updateAction(): void | Promise<void> {}
  public createAction(): void | Promise<void> {}

  private parseExpression(str: string): Expression {
    str = str.replace(/\s/g, ''); // Remove all spaces

    if (str.startsWith('OU(')) {
      return {
        type: 'or',
        expressions: str
          .slice(3, -1)
          .split(',')
          .map((slice) => this.parseExpression(slice)), // we must use an arrow function here to keep the context
      };
    } else if (str.startsWith('ET(')) {
      return {
        type: 'and',
        expressions: str
          .slice(3, -1)
          .split(',')
          .map((slice) => this.parseExpression(slice)), // we must use an arrow function here to keep the context
      };
    } else if (str.startsWith('NOT(')) {
      return {
        type: 'not',
        expression: this.parseExpression(str.slice(4, -1)),
      };
    } else {
      if (str.match(/^!.*/)) {
        return {
          type: 'not',
          expression: this.parseExpression(str.slice(1)),
        };
      }

      const parametersMatch = str.match(/^(ASSO|COTIZ|PROMO)\[([0-9]+)\]$/);

      if (parametersMatch) {
        const [, functionStr, metaStr] = parametersMatch;

        return {
          function: functionStr as any,
          meta: metaStr,
        };
      } else {
        const match = str.match(/^(ALL|CS)$/);

        if (match) {
          const [, functionStr] = match;

          return {
            function: functionStr as any,
          };
        } else {
          throw new Error('Invalid function');
        }
      }
    }
  }

  private async evaluateExpression(
    expression: Expression,
    request: any,
  ): Promise<boolean> {
    if ('type' in expression) {
      if (expression.type === 'not') {
        return !(await this.evaluateExpression(expression.expression, request));
      } else {
        const expressions = await Promise.all(
          expression.expressions.map((expression) =>
            this.evaluateExpression(expression, request),
          ),
        );

        if (expression.type === 'and') {
          return expressions.reduce(
            (acc, expression) => acc && expression,
            true,
          );
        } else if (expression.type === 'or') {
          return expressions.reduce(
            (acc, expression) => acc || expression,
            false,
          );
        } else {
          throw new Error('Invalid expression type');
        }
      }
    } else {
      const { function: functionStr, meta } = expression;

      return await this.functions[functionStr].authorize(request, meta || '');
    }
  }
}

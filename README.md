# FormsV2

VR Forms est un service de création de formulaires intégré avec les fonctionnalités de l'Auth et de LinkCS.

## Premiers pas

Ces instructions vous permettront d'obtenir une copie du projet sur votre machine locale à des fins de développement et de test.

### Prérequis

- [NodeJS](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/installation) - un gestionnaire de paquets plus rapide que npm et yarn
- [Docker](https://www.docker.com/) - pour lancer la base de données avec Docker Compose

- je vous conseille d'utiliser [Visual Studio Code](https://code.visualstudio.com/) comme éditeur de code afin de profiter de l'intégration avec [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) et [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) mais également de l'extension [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) pour faciliter l'édition du schéma de la base de données et de l'extension [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) pour avoir l'autocomplétion des classes [Tailwind CSS](https://tailwindcss.com/).

- si vous mettez à jour le backend, je vous conseille d'utiliser une extension [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) pour tester les requêtes HTTP. Vous pouvez bien sûr utiliser [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) si vous préférez.

### Installation

1. Variables d'environnement

Copier les fichiers **.env.template** situés dans web et api et les renommer en **.env**.

```bash
cp web/.env.template web/.env
cp api/.env.template api/.env
```

2. Installer les dépendances

```bash
pnpm install
```

3. Lancer la base de données

```bash
docker compose up -d
```

4. Appliquer les migrations de la base de données

```bash
cd api
pnpx prisma migrate dev
```

N'oubliez pas de revenir à la racine du projet après avoir appliqué les migrations.

### Lancement

```bash
pnpm dev
```

Vous pouvez également lancer individuellement les applications web et api

Par exemple, cela vous permet de lancer uniquement **api** si vous ne travaillez que sur le backend.

```bash
cd api
pnpm dev
```

### Tests

Assurez-vous que la base de données est lancée avant de lancer les tests.

Attention : les tests suppriment toutes les données de la base de données.

```bash
pnpm test
```

Les tests sont effectués lors de chaque merge et push sur la branche main grâce à [Gitlab CI](/.gitlab-ci.yml).

### Deployment

WORK IN PROGRESS

## Documentation

FormsV2 est un [monorepo](https://pnpm.io/fr/workspaces). Il est composé de deux applications :

WORK IN PROGRESS

## Construit avec

- [TypeScript](https://www.typescriptlang.org/) - Langage
- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [NestJS](https://nestjs.com/) - Framework Node.js
- [Prisma](https://www.prisma.io/) - ORM

Il n'est pas nécessaire de comprendre l'ensemble des technologies utilisées pour pouvoir contribuer au projet.

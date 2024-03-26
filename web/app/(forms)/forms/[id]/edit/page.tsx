import GeneralPage from "./general/page";

export default async function EditForm({ params }: { params: { id: string } }) {
  return <GeneralPage params={params} />;
}

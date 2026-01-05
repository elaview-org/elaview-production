import UnderConstruction from "@/shared/components/under-construction";
import {authenticatedRedirect} from "@/shared/lib/utils";

export default async function Page() {
    await authenticatedRedirect();

    return <UnderConstruction/>;
}
import React from "react";

import { PartnerALogo } from "@/components/logos/PartnerA";
import { PartnerBLogo } from "@/components/logos/PartnerB";

const PartnerLogo = React.memo(({ id }: { id: string }) => {
  switch (id) {
    case "partnerA":
      return <PartnerALogo width={128} />;
    case "partnerB":
      return <PartnerBLogo width={128} />;
    default:
      return null;
  }
});

PartnerLogo.displayName = "PartnerLogo";

export default PartnerLogo;

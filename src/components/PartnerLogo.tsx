import React from "react";

import { PartnerALogo } from "@/components/logos/PartnerA";
import { PartnerBLogo } from "@/components/logos/PartnerB";

const PartnerLogo = React.memo(({ id }: { id: string }) => {
  switch (id) {
    case "partnerA":
      return <PartnerALogo size={32} />;
    case "partnerB":
      return <PartnerBLogo size={32} />;
    default:
      return null;
  }
});

PartnerLogo.displayName = "PartnerLogo";

export default PartnerLogo;

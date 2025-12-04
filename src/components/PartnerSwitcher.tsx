"use client";

import React from "react";
import { usePartner } from "./PartnerContext";
import { Select } from "@/components/ui/select";
import { PartnerALogo } from "@/components/logos/PartnerA";
import { PartnerBLogo } from "@/components/logos/PartnerB";

export const PartnerSwitcher: React.FC = () => {
  const { partner, partners, setPartnerId } = usePartner();

  const renderLogo = () => {
    if (partner.id === "partnerA") return <PartnerALogo />;
    if (partner.id === "partnerB") return <PartnerBLogo />;
    return null;
  };

  return (
    <div className="flex items-center gap-4">
      <label
        htmlFor="partner-select"
        className="text-sm font-medium text-slate-600"
      >
        Partner
      </label>

      <Select
        id="partner-select"
        aria-label="Partner"
        value={partner.id}
        onChange={(e) => setPartnerId(e.target.value)}
        className="border rounded px-2 py-1 text-sm bg-white"
      >
        {partners.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>

      <div className="flex items-center">{renderLogo()}</div>
    </div>
  );
};

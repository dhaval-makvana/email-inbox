"use client";

import React from "react";
import { usePartner } from "./PartnerContext";
import PartnerLogo from "./PartnerLogo";

export const PartnerSwitcher: React.FC = () => {
  const { partner, partners, setPartnerId } = usePartner();

  return (
    <div className="flex items-center gap-4">
      {/* label */}
      <label className="text-sm font-medium text-slate-600">Partner</label>

      {/* select dropdown */}
      <select
        className="border rounded px-2 py-1 text-sm bg-white"
        value={partner.id}
        onChange={(e) => setPartnerId(e.target.value)}
      >
        {partners.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* partner logo component */}
      <div className="flex items-center">
        <PartnerLogo id={partner.id} />
      </div>
    </div>
  );
};

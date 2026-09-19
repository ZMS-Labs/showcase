window.STENO_CASE_STUDY = {
  "cases": [
    {
      "id": "before",
      "label": "Draft A",
      "explanation": "Two selected checks flag a missing notice-mechanics reference and an unclear cap/indemnity relationship.",
      "clauses": [
        {
          "id": "demo-notices",
          "reference": "§ 6",
          "title": "Notices",
          "text": "Notices shall be delivered by email to the notice address designated by each party."
        },
        {
          "id": "demo-incident",
          "reference": "§ 7",
          "title": "Security Incident",
          "text": "Vendor shall provide written notice of a security incident within 24 hours."
        },
        {
          "id": "demo-indemnity",
          "reference": "§ 8",
          "title": "Indemnity",
          "text": "Vendor shall indemnify Customer against covered third-party claims, subject to a separate $300,000 limit."
        },
        {
          "id": "demo-liability",
          "reference": "§ 9",
          "title": "Limitation of Liability",
          "text": "Aggregate liability shall not exceed $100,000. Indemnification is addressed in Section 8."
        }
      ],
      "findings": [
        {
          "id": "notice_obligation_without_mechanics_link",
          "level": "medium",
          "levelLabel": "Check severity: medium",
          "title": "Incident notice lacks a mechanics link",
          "explanation": "Section 7 imposes notice without an explicit link to the delivery mechanics in Section 6. The check flags that drafting gap; it does not decide whether the general Notices article would legally apply.",
          "clauseIds": [
            "demo-incident",
            "demo-notices"
          ],
          "linkLabel": "Locate Sections 6 and 7"
        },
        {
          "id": "indemnity_in_lol_without_carveout",
          "level": "low",
          "levelLabel": "Check severity: low",
          "title": "Indemnity appears in the general cap clause",
          "explanation": "Section 9 mentions indemnification without a recognized carveout. The reviewer needs to settle how its general limit relates to the separate indemnity limit in Section 8.",
          "clauseIds": [
            "demo-liability",
            "demo-indemnity"
          ],
          "linkLabel": "Locate Sections 8 and 9"
        }
      ]
    },
    {
      "id": "after",
      "label": "Draft B",
      "explanation": "The illustrative edit adds a notice-mechanics reference and an explicit indemnity carveout. Those two patterns no longer trigger findings; legal review remains open.",
      "clauses": [
        {
          "id": "demo-notices",
          "reference": "§ 6",
          "title": "Notices",
          "text": "Notices shall be delivered by email to the notice address designated by each party."
        },
        {
          "id": "demo-incident",
          "reference": "§ 7",
          "title": "Security Incident",
          "text": "Vendor shall provide written notice of a security incident within 24 hours, in accordance with the Notices article."
        },
        {
          "id": "demo-indemnity",
          "reference": "§ 8",
          "title": "Indemnity",
          "text": "Vendor shall indemnify Customer against covered third-party claims, subject to a separate $300,000 limit."
        },
        {
          "id": "demo-liability",
          "reference": "§ 9",
          "title": "Limitation of Liability",
          "text": "Aggregate liability shall not exceed $100,000, excluding indemnification obligations. The separate indemnity limit in Section 8 applies to those obligations."
        }
      ],
      "findings": []
    }
  ],
  "evidenceSummary": "Two recorded findings in the initial draft; none from the same two checks after the illustrative edits. Three existing focused component tests also passed."
};

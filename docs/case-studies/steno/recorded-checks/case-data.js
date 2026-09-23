window.STENO_CASE_STUDY = {
  "cases": [
    {
      "id": "before",
      "label": "Initial draft",
      "explanation": "The two checks flag a notice clause that doesn't point to how notice is delivered, and a liability limit that doesn't say how it relates to the indemnity.",
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
          "title": "Incident notice doesn't point to the Notices section",
          "explanation": "Section 7 requires notice but doesn't say it must follow the delivery rules in Section 6. The check flags the missing link. Whether the general Notices section applies anyway is for the reviewer to decide.",
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
          "title": "The general liability limit mentions indemnity",
          "explanation": "Section 9 mentions indemnification without saying whether indemnity sits under that limit or outside it (a carveout). The reviewer needs to settle how the general limit relates to the separate indemnity limit in Section 8.",
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
      "label": "Proposed edits",
      "explanation": "The edits point the incident notice to the Notices section and carve indemnity out of the general limit.",
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
  "emptyFindings": {
    "heading": "No findings from the two checks.",
    "body": "After the edits, neither check flags anything. The two drafting patterns they look for are gone; whether the agreement works is still the reviewer's call."
  }
};

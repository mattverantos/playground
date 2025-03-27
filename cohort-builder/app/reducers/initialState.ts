const initialState = {
  "events": [
    {
      "id": "oral_dmt_index",
      "name": "Oral Disease-Modifying Therapy Prescription",
      "description": "Initial prescription of oral DMT (index event)",
      "entities": [
        "drug"
      ],
      "filters": [
        {
          "id": "oral_dmt_filter",
          "type": "column",
          "logicalOperator": [],
          "columnName": "drug_type",
          "operator": "=",
          "operands": [
            "oral disease-modifying therapy"
          ]
        },
        {
          "id": "route_filter",
          "type": "column",
          "logicalOperator": [],
          "columnName": "route",
          "operator": "=",
          "operands": [
            "oral"
          ]
        }
      ]
    },
    {
      "id": "age_check",
      "name": "Age Check",
      "description": "Verify patient is at least 18 years old on index date",
      "entities": [
        "demographic"
      ],
      "filters": [
        {
          "id": "age_filter",
          "type": "column",
          "logicalOperator": [],
          "columnName": "demographic_date_of_birth",
          "operator": "age_at_least",
          "operands": [
            18.0,
            {
              "id": "oral_dmt_index",
              "column": "drug_date_start"
            }
          ]
        }
      ]
    },
    {
      "id": "rrms_diagnosis",
      "name": "RRMS Diagnosis by Neurologist",
      "description": "Diagnosis of RRMS by neurologist within 6 months before index",
      "entities": [
        "condition"
      ],
      "filters": [
        {
          "id": "rrms_condition",
          "type": "column",
          "logicalOperator": [],
          "columnName": "condition",
          "operator": "=",
          "operands": [
            "relapsing-remitting multiple sclerosis"
          ]
        },
        {
          "id": "neurologist_source",
          "type": "column",
          "logicalOperator": [],
          "columnName": "condition_source",
          "operator": "=",
          "operands": [
            "neurologist"
          ]
        },
        {
          "id": "baseline_period",
          "type": "column",
          "logicalOperator": [],
          "columnName": "condition_date",
          "operator": "between",
          "operands": [
            {
              "id": "oral_dmt_index",
              "column": "drug_date_start"
            },
            {
              "id": "oral_dmt_index",
              "column": "drug_date_start"
            }
          ]
        }
      ]
    },
    {
      "id": "prior_oral_dmt",
      "name": "Prior Oral DMT Use",
      "description": "Any use of oral DMT before index",
      "entities": [
        "drug"
      ],
      "filters": [
        {
          "id": "prior_dmt_filter",
          "type": "column",
          "logicalOperator": [],
          "columnName": "drug_type",
          "operator": "=",
          "operands": [
            "oral disease-modifying therapy"
          ]
        },
        {
          "id": "prior_date_filter",
          "type": "column",
          "logicalOperator": [],
          "columnName": "drug_date_start",
          "operator": "<",
          "operands": [
            {
              "id": "oral_dmt_index",
              "column": "drug_date_start"
            }
          ]
        }
      ]
    },
    {
      "id": "ppms_diagnosis",
      "name": "PPMS Diagnoses",
      "description": "Two or more PPMS diagnoses on separate days during baseline",
      "entities": [
        "condition"
      ],
      "filters": [
        {
          "id": "ppms_condition",
          "type": "column",
          "logicalOperator": [],
          "columnName": "condition",
          "operator": "=",
          "operands": [
            "primary progressive multiple sclerosis"
          ]
        },
        {
          "id": "ppms_baseline_period",
          "type": "column",
          "logicalOperator": [],
          "columnName": "condition_date",
          "operator": "between",
          "operands": [
            {
              "id": "oral_dmt_index",
              "column": "drug_date_start"
            },
            {
              "id": "oral_dmt_index",
              "column": "drug_date_start"
            }
          ]
        }
      ]
    },
    {
      "id": "severe_infection",
      "name": "Severe Infection Hospitalization",
      "description": "Hospitalization for severe infection within 30 days before index",
      "entities": [
        "condition",
        "visit"
      ],
      "filters": [
        {
          "id": "infection_condition",
          "type": "column",
          "logicalOperator": [],
          "columnName": "condition",
          "operator": "=",
          "operands": [
            "severe infection"
          ]
        },
        {
          "id": "hospitalization",
          "type": "column",
          "logicalOperator": [],
          "columnName": "visit_type",
          "operator": "=",
          "operands": [
            "inpatient"
          ]
        },
        {
          "id": "infection_period",
          "type": "column",
          "logicalOperator": [],
          "columnName": "visit_date_start",
          "operator": "between",
          "operands": [
            {
              "id": "oral_dmt_index",
              "column": "drug_date_start"
            },
            {
              "id": "oral_dmt_index",
              "column": "drug_date_start"
            }
          ]
        }
      ]
    },
    {
      "id": "malignancy",
      "name": "History of Malignancy",
      "description": "Prior diagnosis of malignancy excluding non-melanoma skin cancer",
      "entities": [
        "condition"
      ],
      "filters": [
        {
          "id": "malignancy_condition",
          "type": "column",
          "logicalOperator": [],
          "columnName": "condition",
          "operator": "=",
          "operands": [
            "malignancy"
          ]
        },
        {
          "id": "exclude_nmsc",
          "type": "column",
          "logicalOperator": [],
          "columnName": "condition",
          "operator": "!=",
          "operands": [
            "non-melanoma skin cancer"
          ]
        },
        {
          "id": "malignancy_period",
          "type": "column",
          "logicalOperator": [],
          "columnName": "condition_date",
          "operator": "<",
          "operands": [
            {
              "id": "oral_dmt_index",
              "column": "drug_date_start"
            }
          ]
        }
      ]
    }
  ],
  "currentEvent": null,
  "indexEventId": "oral_dmt_index",
  "inclusionCriteria": [
    "oral_dmt_index",
    "age_check",
    "rrms_diagnosis"
  ],
  "exclusionCriteria": [
    "prior_oral_dmt",
    "ppms_diagnosis",
    "severe_infection",
    "malignancy"
  ]
}
export default initialState;

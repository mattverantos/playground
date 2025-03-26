const initialState = {
    "events": [
      {
        "id": "index",
        "name": "Oral DMT Prescription",
        "description": "Prescription of oral disease-modifying therapy",
        "entities": [
          "drug"
        ],
        "filters": [
          {
            "id": "oral_dmt",
            "type": "column",
            "logicalOperator": [],
            "columnName": "drug_type",
            "operator": "=",
            "operands": [
              "oral disease-modifying therapy"
            ]
          },
          {
            "id": "route",
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
        "name": "Age at least 18",
        "description": "Patient is at least 18 years old on index date",
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
              18.0
            ]
          }
        ]
      },
      {
        "id": "rrms_dx",
        "name": "RRMS Diagnosis",
        "description": "Diagnosis of RRMS by neurologist during 6-month baseline",
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
              "Relapsing-Remitting Multiple Sclerosis"
            ]
          },
          {
            "id": "neurologist",
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
            "operator": "within_last",
            "operands": [
              "180"
            ]
          }
        ]
      },
      {
        "id": "prior_dmt",
        "name": "Prior Oral DMT",
        "description": "Any use of oral DMT prior to index",
        "entities": [
          "drug"
        ],
        "filters": [
          {
            "id": "oral_dmt_prior",
            "type": "column",
            "logicalOperator": [],
            "columnName": "drug_type",
            "operator": "=",
            "operands": [
              "oral disease-modifying therapy"
            ]
          },
          {
            "id": "prior_date",
            "type": "column",
            "logicalOperator": [],
            "columnName": "drug_date_start",
            "operator": "<",
            "operands": [
              {
                "id": "index",
                "column": "drug_date_start"
              }
            ]
          }
        ]
      },
      {
        "id": "ppms",
        "name": "PPMS Diagnosis",
        "description": "Two or more diagnoses of PPMS on separate days during baseline",
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
              "Primary Progressive Multiple Sclerosis"
            ]
          },
          {
            "id": "baseline_period",
            "type": "column",
            "logicalOperator": [],
            "columnName": "condition_date",
            "operator": "within_last",
            "operands": [
              "180"
            ]
          }
        ]
      },
      {
        "id": "severe_infection",
        "name": "Severe Infection",
        "description": "Severe infections requiring hospitalization within 30 days prior to index",
        "entities": [
          "condition",
          "visit"
        ],
        "filters": [
          {
            "id": "infection",
            "type": "column",
            "logicalOperator": [],
            "columnName": "condition",
            "operator": "=",
            "operands": [
              "Severe Infection"
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
            "id": "prior_30_days",
            "type": "column",
            "logicalOperator": [],
            "columnName": "condition_date",
            "operator": "within_last",
            "operands": [
              "30"
            ]
          }
        ]
      },
      {
        "id": "malignancy",
        "name": "History of Malignancy",
        "description": "History of malignancy excluding non-melanoma skin cancer",
        "entities": [
          "condition"
        ],
        "filters": [
          {
            "id": "cancer_dx",
            "type": "column",
            "logicalOperator": [],
            "columnName": "condition",
            "operator": "=",
            "operands": [
              "malignant neoplasm"
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
            "id": "prior_to_index",
            "type": "column",
            "logicalOperator": [],
            "columnName": "condition_date",
            "operator": "<",
            "operands": [
              {
                "id": "index",
                "column": "drug_date_start"
              }
            ]
          }
        ]
      }
    ],
    "currentEvent": null,
    "indexEventId": "index",
    "inclusionCriteria": [
      "index",
      "age_check",
      "rrms_dx"
    ],
    "exclusionCriteria": [
      "prior_dmt",
      "ppms",
      "severe_infection",
      "malignancy"
    ]
  }
export default initialState;

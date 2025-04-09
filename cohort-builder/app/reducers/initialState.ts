const initialState = {
  "events": [
    {
      "id": "oral_dmt",
      "name": "Oral Disease-Modifying Therapy",
      "description": "Prescription of oral disease-modifying therapy (index event)",
      "computedColumns": [],
      "entities": [
        "drug"
      ],
      "filters": [
        {
          "id": "oral_dmt_filter",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "route",
          "operator": "=",
          "operands": [
            "ORAL"
          ]
        },
        {
          "id": "dmt_type",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "drug_type",
          "operator": "=",
          "operands": [
            "DMT"
          ]
        }
      ]
    },
    {
      "id": "age_check",
      "name": "Age at Index",
      "description": "Patient age calculation at index date",
      "computedColumns": [
        {
          "id": "age_at_index",
          "name": "age_at_index",
          "function": "SUBTRACT",
          "operand": [
            {
              "id": "oral_dmt",
              "column": "drug_start_date"
            },
            "birth_date"
          ]
        }
      ],
      "entities": [
        "demographic"
      ],
      "filters": []
    },
    {
      "id": "rrms_diagnosis",
      "name": "RRMS Diagnosis",
      "description": "RRMS diagnosis by neurologist during baseline",
      "computedColumns": [],
      "entities": [
        "condition"
      ],
      "filters": [
        {
          "id": "rrms_condition",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "condition",
          "operator": "=",
          "operands": [
            "RRMS"
          ]
        },
        {
          "id": "diagnosis_timing",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "condition_start_date",
          "operator": "BETWEEN",
          "operands": [
            {
              "id": "oral_dmt",
              "column": "drug_start_date"
            },
            {
              "id": "oral_dmt",
              "column": "drug_start_date"
            }
          ]
        }
      ]
    },
    {
      "id": "prior_oral_dmt",
      "name": "Prior Oral DMT Use",
      "description": "Any use of oral DMT prior to index",
      "computedColumns": [],
      "entities": [
        "drug"
      ],
      "filters": [
        {
          "id": "prior_oral_route",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "route",
          "operator": "=",
          "operands": [
            "ORAL"
          ]
        },
        {
          "id": "prior_dmt_type",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "drug_type",
          "operator": "=",
          "operands": [
            "DMT"
          ]
        },
        {
          "id": "prior_timing",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "drug_start_date",
          "operator": "<",
          "operands": [
            {
              "id": "oral_dmt",
              "column": "drug_start_date"
            }
          ]
        }
      ]
    },
    {
      "id": "ppms_diagnosis",
      "name": "PPMS Diagnoses",
      "description": "Two or more PPMS diagnoses on separate days during baseline",
      "computedColumns": [],
      "entities": [
        "condition"
      ],
      "filters": [
        {
          "id": "ppms_condition",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "condition",
          "operator": "=",
          "operands": [
            "PPMS"
          ]
        },
        {
          "id": "ppms_timing",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "condition_start_date",
          "operator": "<",
          "operands": [
            {
              "id": "oral_dmt",
              "column": "drug_start_date"
            }
          ]
        }
      ]
    },
    {
      "id": "severe_infection",
      "name": "Severe Infection Requiring Hospitalization",
      "description": "Severe infections requiring hospitalization within 30 days prior to index",
      "computedColumns": [],
      "entities": [
        "condition",
        "visit"
      ],
      "filters": [
        {
          "id": "infection_condition",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "condition_type",
          "operator": "=",
          "operands": [
            "SEVERE_INFECTION"
          ]
        },
        {
          "id": "hospitalization",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "visit_type",
          "operator": "=",
          "operands": [
            "INPATIENT"
          ]
        },
        {
          "id": "infection_timing",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "condition_start_date",
          "operator": "BETWEEN",
          "operands": [
            {
              "id": "oral_dmt",
              "column": "drug_start_date"
            },
            {
              "id": "oral_dmt",
              "column": "drug_start_date"
            }
          ]
        }
      ]
    },
    {
      "id": "malignancy",
      "name": "History of Malignancy",
      "description": "Prior malignancy excluding non-melanoma skin cancer",
      "computedColumns": [],
      "entities": [
        "condition"
      ],
      "filters": [
        {
          "id": "malignancy_condition",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "condition_type",
          "operator": "=",
          "operands": [
            "MALIGNANCY"
          ]
        },
        {
          "id": "exclude_nmsc",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "condition",
          "operator": "!=",
          "operands": [
            "NON_MELANOMA_SKIN_CANCER"
          ]
        },
        {
          "id": "malignancy_timing",
          "type": "column",
          "logicalOperator": "AND",
          "columnName": "condition_start_date",
          "operator": "<",
          "operands": [
            {
              "id": "oral_dmt",
              "column": "drug_start_date"
            }
          ]
        }
      ]
    }
  ],
  "currentEvent": null,
  "indexEventId": "oral_dmt",
  "inclusionCriteria": [
    "oral_dmt",
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

import instructor
from anthropic import Anthropic
from pydantic import BaseModel, Field
from typing import List, Optional, Union
from typing_extensions import Literal
from enum import Enum, StrEnum

# Define enums for FilterType and FilterOperator
class FilterType(str, Enum):
    COLUMN = 'column'
    # OCCURRENCE = 'occurrence'

class FilterOperator(str, Enum):
    AND = 'AND'
    OR = 'OR'
    NOT = 'NOT'


class Column(str, Enum):
    condition_type = 'condition_type'
    condition_status = 'condition_status'
    condition_source = 'condition_source'
    condition = 'condition'
    condition_start_date = 'condition_start_date'
    condition_end_date = 'condition_end_date'
    
    drug = 'drug'
    drug_type = 'drug_type'
    drug_source = 'drug_source'
    drug_date_start = 'drug_start_date'
    drug_date_end = 'drug_end_date'
    route = 'route'
    
    measurement = 'measurement'
    measurement_type = 'measurement_type'
    measurement_source = 'measurement_source'
    measurement_value = 'measurement_value'
    measurement_unit = 'measurement_unit'
    measurement_range_high = 'measurement_range_high'
    measurement_range_low = 'measurement_range_low'
    measurement_date = 'measurement_date'

    observation_date = 'observation_date'
    observation_type = 'observation_type'
    observation_value = 'observation_value'
    observation_unit = 'observation_unit'
    
    procedure = 'procedure'
    procedure_type = 'procedure_type'
    procedure_modifier = 'procedure_modifier'
    procedure_quantity = 'procedure_quantity'
    procedure_date = 'procedure_date'

    visit = 'visit'
    visit_type = 'visit_type'
    visit_source = 'visit_source'
    visit_date_start = 'visit_start_date'
    visit_date_end = 'visit_end_date'

    demographic_race = 'race'
    demographic_ethnicity = 'ethnicity'
    demographic_gender = 'gender'
    demographic_date_of_birth = 'birth_date'

class Condition(StrEnum):
    condition_type = 'condition_type'
    condition_status = 'condition_status'
    condition_source = 'condition_source'
    condition = 'condition'
    condition_start_date = 'condition_start_date'
    condition_end_date = 'condition_end_date'




class Column[E: (Literal['condition'], Condition)]:




class ColumnOperator(str, Enum):
    EQUALS = '='
    NOT_EQUALS = '!='
    GREATER_THAN = '>'
    GREATER_THAN_OR_EQUALS = '>='
    LESS_THAN = '<'
    LESS_THAN_OR_EQUALS = '<='
    IN = 'IN'
    NOT_IN = 'NOT IN'
    BETWEEN = 'BETWEEN'

class ColumnFunction(str, Enum):
    ADD = 'ADD'
    SUBTRACT = 'SUBTRACT'
    MULTIPLY = 'MULTIPLY'
    DIVIDE = 'DIVIDE'
    CONCAT = 'CONCAT'


class Entity(str, Enum):
    CONDITION = 'condition'
    DRUG = 'drug'
    OBSERVATION = 'observation'
    MEASUREMENT = 'measurement'
    PROCEDURE = 'procedure'
    VISIT = 'visit'
    DEMOGRAPHIC = 'demographic'


type EventId = str
type ComputedColumnId = str
type LiteralValue = str | float

class EventColumn(BaseModel):
    id: EventId
    column: Column


# Base filter model with common fields
class BaseFilter(BaseModel):
    id: str
    type: FilterType
    logicalOperator: Optional[FilterOperator]

type Operand = Union[LiteralValue, EventColumn, ComputedColumnId, Column]

class ComputedColumn(BaseModel):
    id: ComputedColumnId
    name: str
    function: ColumnFunction
    operand: list[Operand]

# Column filter model, extending BaseFilter
class ColumnFilter(BaseFilter):
    type: Literal['column']
    columnName: Column
    operator: ColumnOperator
    operands: tuple[Operand] | tuple[Operand, Operand] = Field(description="Expressions are not allowed. Use computedColumns for those")


# Event model containing filters
class Event(BaseModel):
    id: EventId
    name: str
    description: str
    computedColumns: List[ComputedColumn] = Field(description="Useful for calculating patient age, drug duration, or other derived values.")
    entities: List[Entity | EventId] = Field(description="Do NOT  set more than one unless it is a UNION operation.")
    filters: List[ColumnFilter] = Field(description="Filters cannot include calculations like the computedColumns field. It can only perform comparisons on columns  or literal values")

# CohortState model
class CohortState(BaseModel):
    events: List[Event]
    currentEvent: Optional[Event] = None
    indexEventId: Optional[str] = None
    inclusionCriteria: List[str]
    exclusionCriteria: List[str]

# Initialize the Anthropic client
anthropic_client = Anthropic()

# Create an instructor-enhanced client
client = instructor.from_anthropic(anthropic_client)

# Define the prompt to guide Claude
# while True:
    # prompt = input("\n\n> ")
prompt = """
Include patients with all of the following:

Prescription of oral disease-modifying therapy (index event)

At least 18 years old on the index date

Documented diagnosis of RRMS by a neurologist during the 6 month baseline period

At least 6 months of observability in baseline and follow-up

Exclude patients with any of the following:

Any use of oral disease-modifying therapy prior to index

At least two diagnoses of primary progressive multiple sclerosis (PPMS) on separate days, in baseline.

Severe infections requiring hospitalization within the 30 days prior to index

History of malignancy, excluding non-melanoma skin cancer


"""
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=2048,
    messages=[{"role": "user", "content": prompt}],
    response_model=CohortState
)

# Output the structured CohortState instance
print(response.model_dump_json(indent=2))

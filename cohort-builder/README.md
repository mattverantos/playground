This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Features

### Criterion Builder

The current application focuses on a three step process for defining cohorts. The first step is defining events which means you are filtering on event concepts related entities, numeric filtering, and "uniqueness" which I like to call frequency filtering. The second step is derived events which builds on the events to do higher order logic (merge/sequence), or event instance selection. The third step is selecting the index date (it is required that it be a derived instance event), and selection criteria. The selection criteria is a selection of events where a patient has at least one occurrence, but you can also do a new type of filtering which is on demographics (birth/age/gender/race/ethnicity).

There are competing goals that determine the features of the cohort builder. One is cohort exploration and the other is study definition. They are competing because when you do data exploration, you don't necessarily know or want to set up an index date. You may first want to see the distribution of some column. Or you may want to see how many patients a specific criterion affects.

#### New features

* Set a date restriction on specific events
* Set an event date when all other criteria met
* Specify an event not happening in a sequence or time window (AND NOT operator should allow this)
* Specify criteria on duration of an event
* Index date relative to an event (need to computed column section)

Look into sum(duration) between some study period

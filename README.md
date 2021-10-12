# Spotify Moods

See how your mood affects your music

## Product

**Hypothesis**: someone's mood is significantly reflected by the music they listen to, for example when someone is sad they listen to more sad music. Therefore it may be possible to build a mood tracker inferred from the music someone listens to.

### Strategy

#### Proof of concept

##### Goal

Determine if it's possible to retrieve a person's music history and data that could be used to infer their mood.

##### Method

Spotify was chosen as a data resource because of its popularity as a music streaming service and its accessible API. An accessible API increases the chance of the ability to retrieve relevant data. Its popularity as a music streaming service gives access to a wide range of users.

Spotify's API offers an "audio features" resource. On this resource is a property called "valence" which could be used to infer mood. For music, valence is:

> A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).

For psychology, valence is:

> Valence, or hedonic tone, is the affective quality referring to the intrinsic attractiveness/"good"-ness (positive valence) or averseness/"bad"-ness (negative valence) of an event, object, or situation. The term also characterizes and categorizes specific emotions.

In regards to a person's music history, Spotify unfortunately do not offer an API for this. The closest thing they offer is the last 50 most recently played tracks. As a result it is not possible to do significant historical analysis.

##### Result

☑️ Goal met, it is possible to retrieve a person's music history and data that could be used to infer their mood.

#### Earliest Testable Product (⭐️ we are here)

##### Goal

Determine if valence data is useful for users

##### Method

Web app built that:

- Authorizes access to a user's recently played data from Spotify so that we can do analysis
- Authenticates user so that only the user can view their own data
- Displays valence for various periods over time
- Allows the user to delete their account and any data we hold on them

Backend that:

- Orchestrates authorization with Spotify with OAuth
- Polls Spotify API for recently played data, processes and stores it
- Fetches audio features for recently played data, processes and stores it
- Calculates valence statistics

## Technology

### Stack

In general time to get productive and developer experience was prioritised and other factors such as speed and performance were traded off to get something live as quickly as possible.

#### Language

TypeScript

👍🏼 Pros

- Can be used across the stack, less context switching
- Type safety, reduces risk of bugs getting into production, quicker development feedback
- I'm familiar with it

#### Database

Firebase Realtime Database was chosen as the database.

👍🏼 Pros

- Flexibility: schema-less, allowing change as we turn unknowns into knowns
- Good developer experience during development: almost zero config or setup required as the Firebase command line interface offers an emulator for the database

👎🏼 Cons

- Limited querying flexibility, no joins
- Slow performance compared to other databases

#### Cloud computing

Google Cloud Functions was chosen as the cloud computing provider.

👍🏼 Pros

- Cost: Low cost, practically free (2M invocations/month free, it is extremely unlikely this will be hit)
- Good developer experience during development: almost zero config or setup required as the Firebase command line interface offers an emulator for cloud functions
- Integration: low-effort integration with the rest of the Firebase stack and HTTP, compared to AWS which requires more configuration and the API Gateway service.

👎🏼 Cons

- Long cold start times compared to AWS (<2s vs <1s)

#### Hosting

Firebase hosting was chosen as the hosting provider.

👍🏼 Pros

- User experience: almost zero config or setup

#### Frontend

React was chosen as the frontend library.

👍🏼 Pros

- Solves the problem of translating data into a view well – don't want to reinvent this wheel
- Developer experience: command line interface to quickly boostrap project with zero config
- Familiarity

### Test

#### Unit tests

Jest, a testing framework, was setup for the backend and pre-setup for the frontend. Some unit tests were implemented for the backend but ultimately in general unit tests were traded off for reduced time to go live.

#### Other tests (integration and end-to-end)

All other tests were traded off for reduced time to go live. I would implement integration tests with Jest and end-to-end tests with Cypress.

### Ship

#### Continuous integration/delivery/deployment pipeline

CI/CD pipelines were traded off for reduced time to go live. I would have considered GitHub actions or CircleCI for implementation.

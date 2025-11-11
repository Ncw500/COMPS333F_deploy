# Agent

What are agents?

- An **agent** is anything that can be viewed as perceiving its **environment** through **sensors** and acting upon that environment through **actuators.**
  - Humans as agent
    - sensors → eyes, ears, …
    - actuators → hands, legs, mouth, …
  - Robotic agents
    - sensors → cameras, microphone, infrared range finders
    - actuators → various tools, motors, propulsion system

The concept of precept

- Percept → refers to the agent’s perceptual inputs at any given instant.
- Percept sequence → An agent’s percept sequence is the complete history of everything the agent has ever perceived.
- Agents’s behaviour → is described by the **agent function** that maps any given percept sequence to an action: $[f:P^* → A]$
  - What is purpose of the agent function? → The agent function maps from percept histories to actions.
  - The **agent program** runs on the physical architecture (environment) to produce $f$

---

# Rational Agents

The differences between agent and rational agent:

- An agent is an entity that perceives and acts.
- A rational agent selects actions that maximise its (expected) utility.

What criteria does a rational agent use to ensure its actions are rational?

- Characteristics of the **percepts**, **environment**, and **action space** dictate techniques for selecting rational actions.
- The right action is the one that will cause the agent to be most successful.

How should we measure the performance of an agent's behavior?

- An objective criterion for the success of an agent’s behaviour(actions) → we should design performance measures according to what actually wants in the environment.
- The standards for measuring performance can be viewed from multiple perspectives
  - For example: The performance measures of a vacuum-cleaner agent:
    - The amount of dirt cleaned up
    - The amount of time taken
    - The amount of electricity consumed
    - The amount of noise generated

Rationality and omniscience

- An omniscient agent knows the actual outcome of its actions and can act accordingly; but omniscience is impossible in reality.
- Rationality is not the same as perfection.

Agents can progress through learning (Autonomous Agents)

- Agents can perform actions in order to modify future percepts to obtain useful information (information gathering, exploration).
- An agent is autonomous if its behaviour is determined by its own experience (with the ability to learn and adapt).

---

# PEAS

In designing an agent, the first step must always be to specify PEAS as fully as possible

- Performance measure → The specific measurement criteria of the goals you hope the agent can achieve.
- Environment → In what environment does the agent work?
- Actuators → What actions can an agent take?
- Sensors → Components that enable agents to perceive the environment.

---

# Environment Types

Fully observable vs Partially observable

- Fully observable → The sensors of the agent can obtain complete information and status of the environment at any time.
- Partially observable → The sensors of the agent can only obtain limited information and status at a certain point in time.

Deterministic vs Nondeterministic vs Strategic

- Deterministic → The next state of the environment is entirely determined by the current state and the actions performed by the agent.
- Nondeterministic → The next state of the environment is only partially determined by the current state and the actions performed by the agent.
- Strategic → The next state of the environment depends only on the actions of other agents, not random events.

Static vs Dynamic

- Static → The environment will not change during the agent's consideration period.
- Semi-dynamic → The environment itself remains unchanged over time, but the performance score of the agent will change.
- Dynamic → The environment will change during the agent's consideration period.

Single agent vs multi-agent

- Single agent → The agent operates **alone**; only its own actions affect the environment.
- Multi-agent → There are multiple agents, each able to act and influence the environment and each other.

Episodic vs Sequential

- Episodic → Each perception-action pair is independent.
- Sequential → Actions depend on past percepts and affect future ones.

Discrete vs Continuous

- Discrete → Finite, countable states and actions.
- Continuous → Infinite, real-valued states and actions.

---

# Types of Agents

How can theoretical intelligent agents be implemented in practice?

- The behavior of an intelligent agent is entirely determined by its **agent function**, which maps every possible sequence of perceptions to an appropriate action.
- In theory, we could implement this function by using a huge lookup table that records every possible sequence of percepts and its corresponding action. Such an agent is called a **Table-lookup agent**.
- However, this is difficult to achieve because:
  - It requires constructing a table that covers **all possible percept sequences**.
  - The table would be **enormous** and take an extremely long time to build.
  - The agent would **lack autonomy** — it cannot learn or adapt on its own.
- Therefore, we aim to produce **rational behavior** from a **compact, intelligent program**, rather than from a vast lookup table.

Four more efficient and intelligent practical models were produced to solve this problem

1. **Simple reflex agents** → select actions based only on the current percept, ignoring the history of previous percepts.

   - Does an agent decide what to do only based on "what is seen at the moment”.
   - It does not remember the past nor reason about the future.
   - The behavior is completely of the "immediate response" type.
   - The operation process of the model: **Precept → Rule match → Action**
   - It can only work effectively in a fully observable static environment because it cannot take action when the rule matching fails (without the corresponding perception-behavior).

2. **Model-based reflex agents** → keeps track of the part of the world it can’t currently see by maintaining an internal state that depends on percept history and a model describing how the world evolves and how the agent’s actions affect it.

   - Unlike simple reflective agents that can only rely on "current perception", model-based agents "remember" previous information and "infer" the current state of the world.
   - It has an internal state, which helps it understand those parts of the world that are "currently invisible but may exist".
   - The operation process of the model: **Precept → Update State (previous state, previous action, current percept, model) → Rule Match → Action**
   - It can work under partially observable conditions by using the internal state and model to update the understanding of the world and then select actions according to the rules.

3. **Goal-based agents** → act not only on the current state of the environment but also based on a goal — a desired situation or outcome they want to achieve.

   - Model-based agents only know "how the world is now", while Goal-based agents know "how I want the world to become".
   - It will choose actions that can achieve the goal rather than just passively react.
   - The operation process of the model: **Precept → Update State (previous state, previous action, current percept, model) → Goal (desired state) → Search / Planning (decide which action leads to goal) → Choose Action → Execute**

4. **Utility-based agents** → choose actions not only to achieve goals, but also to maximize their happiness or preference, as measured by a utility function.
   - Goal-based agents only care about "whether the Goal has been achieved" (success or failure), while Utility-based agents not only care about "whether it has been achieved", but also measure "whether it has been achieved well".
   - It uses an indicator called a **utility function** to compare the "satisfaction level" of different world states.
   - The operation process of the model: **Precept → Update State (previous state, previous action, current percept, model) → Goal (desired state) → Search / Planning (decide which action leads to goal) → Evaluate Utility [Utility Function] (based on predicted states) → Choose Action [Decision Function] (that maximizes expected Utility) → Execute**

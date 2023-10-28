---
title: Introduction
after: 0
---

# Getting started with reviews
[[toc]]
## Introduction

Before you start reviewing submissions there are some things that are important to keep in mind while reviewing plugins. 

It is easy to get carried away obsessing over code quality, performance, coding conventions, and other technical aspects when reviewing a plugin. However, it is important to not lose sight of what we are really trying to achieve here.

Above everything else, we are here to build and manage a happy and healthy community. While code quality is certainly important, and maintaining a base level of code quality is in out best interest for the sake of our reputation as a trustworthy place to find plugins and resources, it is far more important to avoid demoralising new (or even experienced) developers with harsh, scathing reviews of what might be their first ever Oxide plugin.

## Principles

It is important that, as a team, we are all aiming in the same direction with our plugin reviews. As a result, it is important that we define some core principles of what we are trying to achieve.

### Balanced and fair

It is likely that you will be reviewing plugins made by people you might already know or have an existing relationship with. We aim to provide unbiased, fair reviews **of the code** not the person, their reputation, or based on any personal grievances you might have.

### Professional

While you are reviewing a plugin, please keep in mind you are representing Oxide. As a result, we ask that you conduct yourself in a professional manner. Outside of reviews you are free to act as you wish, however for the purpose of reviews please be on your best behaviour.

Here are some general points:

- Keep it civil, act in a non-confrontational manner and avoid arguing.
- Criticise the code, not the developer directly.
- Do not assume the developer lacks knowledge or ability and has instead just forgotten.
- Assume that the developer knows things that you do not, conversations do not always have to be one way.

### Community first

Our main goal is to build and manage a flourishing community of developers and server owners that are passionate about modding Unity games. We as Oxide should put our community first. We would be nothing if it were not for the hundreds of developers and server owners that put their trust in us and show their support.

### Quality over quantity

While it is important to push plugins through the review process at a reasonable pace, it is more valuable to us to perform in-depth and thorough reviews despite the fact that this might mean a plugin sits in the queue for a little longer. This is for two reasons. 

The first is to build and maintain our reputation as a place for quality plugins. We take pride in the plugins on our site and we want to avoid being known as a cesspool of poorly coded plugins. 

Secondly, if we are more thorough with our reviews, we are able to provide more and better feedback to the author.

We would like to build a reputation as a place for high quality resources. The downside to this is that we may also gain a reputation for being slow. However, that is much easier to shake than the other way around.

#### How do we measure quality?

To us, quality is being consistent with what we allow and don't allow, providing useful feedback to the author, and ensuring each plugin that passes through is of an acceptable quality.

A high quality review would be a review that does not miss any guideline violations and notices and brings up the majority of code quality issues, while providing in-depth and useful feedback about those issues.

#### Making mistakes

To be clear, this does not mean that you cannot make mistakes. We expect that over the course of doing a review, it is possible that you might miss something that would violate a guideline or miss a major issue, or forget to check something off. This is why we require two reviewers to approve a plugin before it can be released. So don't worry about getting something wrong.

We are not looking for perfection, that is impossible. All we ask is that you try your best and that if you make a mistake, you do not shy away from it but instead learn from it to make your next review even better.

## Important Things to Remember

### Personality conflicts

You may only be judging the code, it is important to consider any previous relationship you might have with the plugin's author. If you have an existing, negative relationship or have had poor experiences with them in the past, then it might be a better idea to not review that particular plugin and allow one of your fellow reviewers to handle it.

### Presenting feedback

An integral part of the plugin review process is the "issues" section, where the reviewer is able to make comments and provide feedback to the developer on places where they could improve their code.

Feedback and criticism is a very useful way to improve and develop knowledge. Criticism is not necessarily bad, however, when criticising another person's work, the way you approach this is critical.

### Different ways of learning

Considering that a large part of the review process is about providing feedback to the developer. It is important to remember that some people learn in different ways than others.

Some people may enjoy receiving feedback directly. This is also considered the "easy" way, which isn't a bad thing. Information provided by others can be invaluable to quickly develop ones understanding and save hours of time researching or painstakingly using trial and error methods.

However, other people may not want to take these shortcuts. Instead opting to discover this knowledge and gather experience themselves (aka, the hard way).

These are both very valid ways of learning and ideally, the reviewer should identify which method the developer prefers or finds easiest to learn with and try their best to accommodate it.

### Reviews are a two way process

Reviews are essentially a negotiation. The developer is offering their work to us to provide content for the users of our website and framework, and in return, we offer a place for them to host and distribute their work (as long as they follow our rules).

Essentially, what we mean by this is don't go into a review with a closed mind. Some issues you will pretty clearly be right, but if the developer disagrees with your feedback, listen to what they have to say in response. It might only become clear after they have explained themselves that what they have done actually does make sense.

## General Rules

We have some general rules for our plugin reviews that help us maintain quality and a happy community of developers. Some rules that plugins must follow are:

- Submitter be the original author of the plugin.
- No AIO (All In One) plugins.
- No plugins that support or enable piracy, or enable bypassing paid (DLC) content.

There are also some general rules we have for what can be included in the code.

- No "Loaded" or "Made by ___" messages in Init or other methods.
- No "__ has joined the server" messages **for specific players** (like the plugin developer).
- No advertising, even in comments.
- Avoid walls of using statements at the top of the plugin. Should only be the ones that are in use.
- Avoid large chunks of commented out code. If it's not being used then it should be removed for cleanliness and maintainability. Keeping track of old and future code is for version control tools.
- License terms or any other random terms type stuff should not be pasted in the code.
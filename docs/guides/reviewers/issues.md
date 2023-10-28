---
title: Issues
after: guidelines
---

# Issues

Issues are the current name given to suggestions and feedback that the reviewer gives. This feedback can be related to anything about the plugin, though it is most commonly code related.

There is no "quota" for issues, however, we believe that the majority of major issues should be caught and raised in order to maintain code quality.

There are three severity ratings you can assign to an "issue".

## May fix

This is the lowest severity level, this is generally applied to suggestions of the least importance. These are optional and the developer does not have to follow the suggestion or take the feedback into account.

This level is typically what you would use for minor suggestions. For example, code formatting, alternate methods, or any other non-critical feedback that you might have.

## Should fix

This is the second severity level, this is generally applied to suggestions that hold some importance but are not crucial to the plugin functioning or for the plugin to conform to our review guidelines.

You would typically use this level for changes that the author really should make, but if not made would not affect the plugin in a serious way.

Some examples of when you would use this are:
- Unused fields or methods that can be removed.
- Minor to moderate performance issues.
- Nesting

You should only really use this over may fix if it is strongly recommended that the author make the suggested change.

## Must fix

This is the highest severity level, this is generally applied to critical changes that **must** be fixed before the plugin can be approved. 

This level is only applied to problems that must be addressed otherwise the plugin is at risk of poor performance or worse case not working at all. Alternatively this can be used to flag issues that mean the plugin cannot be approved, but the rules is not necessarily one of the guidelines (see general rules).

Some examples of when you would use this are:
- Major performance issues.
- Obsolete functionality (obsolete/deprecated hook or method).
- Malicious or exploitable code.
- Improper usage, for example, loading config in Init().
- Anything related to a guideline failing.

Issues with this severity will stall a review, so make sure that this is only used where it is necessary.
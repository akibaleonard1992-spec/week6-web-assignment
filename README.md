# SpendWise

SpendWise is an interactive budgeting dashboard built with HTML, CSS, and JavaScript.

## Improvements Made

This project now includes dynamic budget totals, expense entry and deletion, budget progress feedback, input validation, expense counts, category icons, and a light/dark theme toggle.

All monetary values are formatted in Kenyan shillings (KES).

## Conditional Statements

JavaScript conditionals validate expense names and amounts, check that the monthly budget is valid, and determine whether spending is on track, nearly at the limit, or over budget. The delete control and empty state are also selected conditionally.

## Arrays

Expense records are stored in the `expenses` array. Each record contains a name, amount, and category. Adding and deleting expenses updates this array.

## Loops

The dashboard uses a loop in `getTotalSpent()` to calculate spending across all expense records. It also loops through the array in `renderExpenses()` to create and display each expense row.

## DOM Updates

The DOM is updated by changing summary text, the progress width and accessibility value, the budget status, the expense count, and the expense list. Expense records are rendered with `createElement()` and `appendChild()`.

## Events and Interactions

The expense form uses a submit event listener, the budget field responds to input events, delete buttons respond to list clicks, and the theme button toggles the page mode.

## Challenges

Keeping totals and progress synchronized after additions, deletions, and budget changes was managed by centralizing dashboard updates in `updateDashboard()`. User-entered expense names are escaped before insertion so they remain safe text in the page.

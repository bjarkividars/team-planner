# Headcount Planner

A tool for modeling how hiring affects runway.

## How I approached it

### Visualizing burn alongside roles

The hardest part was figuring out how to show cash burn and balance while also showing the role timeline. I tried a few approaches—inline sparklines, a combined view—but they all felt too busy. Eventually I separated the chart entirely into its own dialog. Simpler to build and easier to read for the user.

### Responsive layout

I spent a good amount of time making sure the layout works across screen sizes. The role palette, timeline, and scenario tabs all needed to adapt without breaking the drag-and-drop interactions.

### URL-based sharing

The plan state encodes into the URL, so sharing is just copying a link.

### Local storage

The plan saves to local storage automatically, so you don't lose your work if you close the tab or refresh.

## What's next

- Add options for users to input their own custom roles/salaries. Add in more salary data from more areas.
- More export options:
  - CSV/XLSX for spreadsheet workflows
  - PDF for board presentations
  - Email (send PDF directly) for investor communication

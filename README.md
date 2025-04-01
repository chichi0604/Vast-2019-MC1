# VAST Challenge 2019 Mini Challenge 1

## Overview

St. Himark has been hit by an earthquake, leaving officials scrambling to determine the extent of the damage and to dispatch limited resources to the areas most in need. Initial seismic readings have been used for the first deployment; however, additional information is necessary to gain a realistic understanding of the true conditions throughout the city.

In a proactive step toward community engagement, the city released a new damage reporting mobile application shortly before the earthquake. This app enables citizens to provide timely information to help officials assess damage and prioritize their response. **Note:** Shake maps used in this challenge are from April 6 and April 8 respectively.

With emergency services stretched thin, officials now rely on citizen reports to gather crucial information about the quake’s effects and to focus recovery efforts effectively. By combining seismic readings, app responses, and background knowledge of the city, your task is to help triage rescue and recovery operations.

## Analysis Tasks

1. **Prioritizing Response Based on Shake Maps and Citizen Reports**  
   - Use visual analytics to determine how emergency response strategies should change in light of damage reports from citizens.
   - Decide how to prioritize neighborhoods for response.
   - Identify which parts of the city are hardest hit.

2. **Visualising and Assessing Data Uncertainty**  
   - Use visual analytics to illustrate uncertainty in the available data.
   - Compare the reliability of neighborhood reports.
   - Determine which neighborhoods are providing reliable reports and justify your rationale.

3. **Tracking Temporal Changes**  
   - Analyze how conditions change over time.
   - Examine how the uncertainty associated with these conditions evolves.
   - Describe the key changes you observe over time.

## Visualisation App Requirements

- **Objective:** Develop one or more interactive visualisation applications that answer the analysis tasks outlined above.
- **Design Options:**  
  - You may create a separate app for each question, or a single app that addresses all three tasks through one or more linked visualisations.
- **Restrictions:**  
  - **Do not reuse** the design or code from the example apps `example1` and `example2`.

## Implementation Guidelines

Your visualisation app(s) must be implemented in **JavaScript**. The following libraries are available for use:

- **D3.js:**  
  A low-level visualisation library ideal for creating custom charts.  
  *Tutorials:* Michael Oppermann, Scott Muarry (code examples available online).

- **Echarts:**  
  An open-source library that provides a wide range of pre-made chart types.

- **Chart.js:**  
  Another open-source library offering many pre-made charts.

- **Vega-Lite.js:**  
  A high-level visualisation library that allows for concise code to build interactive visualisations.

- **Observable Plot:**  
  A JavaScript visualisation library that includes many common visualisations available in Observable, and it can be integrated with the Observable Framework for dashboard development.

**Important:** Do not use Observable Notebook as covered in COMP3021.


# AquaSentinel
## Run in Antigravity
Open this extracted project folder in Antigravity. In its terminal, run:
```sh
python -m http.server 8000 --directory dist
```
Visit http://localhost:8000. On Windows you can use py instead of python. Alternatively, open dist/index.html directly. No package installation, account, or external asset is required.
## Demo
Open the 3D vessel lab, drag to orbit, select Sonar, and toggle the exploded view. Open Survey simulator and start the mission. Watch the boat sample a synthetic reservoir and inspect the sonar section, then open Dashboard during the run. In Verification, collect a simulated core and record an inspection decision. Survey comparison scores both routes after 82 simulated seconds. Export the mission in Mission reports before resetting or closing the tab.
## Source
dist/engine.js contains the terrain, acoustic sensor, estimator, planners and scoring. dist/twin.js defines the original mesh, projection, component selection and camera. dist/ui.js contains simulation controls, analysis views, reports and routing. dist/index.html, style.css and console.css implement the interface.
## Model scope
The vessel viewer is a conceptual assembly. The survey uses discrete five-metre steps, synthetic echoes, peak picking, inverse-distance interpolation and heuristic adaptive sampling. Forecasts use a selectable growth assumption. All site readings are simulated. The 3D lab illustrates hardware while the survey simulator runs the sensing and mission model.

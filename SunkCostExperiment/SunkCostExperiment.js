/* Remove comment notation below if want to run in browser */
var jsPsych = initJsPsych({
  on_finish: function() {
    // window.parent.postMessage('iframecomplete', '*');
    mydata = jsPsych.data.get().json();
    window.parent.postMessage({event: 'iframecomplete', data: mydata}, '*');
    // jsPsych.data.displayData();
  }
});

/* put html in separate file */

/* experiment parameters */
var projects_completed = 0;
var investments_made = 0;
var max_projects = 30;
var max_hours = 3500;
var hours_remaining = 3500;
var master_links = [[5, 5], [5, 20], [5, 50], [5, 80], [5, 95], [20, 5], [20, 20], [20, 50], [20, 80], [20, 95], [35, 5], [35, 20], [35, 50], [35, 80], [35, 95]];
var links = master_links.slice();
var my_initial_link = 0;
var my_terminal_link = 0;



/*set up welcome block*/
var welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Welcome to the experiment. Press any key to begin."
};

/*set up instructions block*/
var instructions = {
  type: jsPsychHtmlButtonResponse,
  choices: ['OK'],
  stimulus: "<p>The current task will involve investing (hypothetical) time to complete projects. Each project will take time to set up (20 hours on average) and will take time to complete (50 hours on average). These times, however, will vary from project to project. You must invest the hours to set up each project but can opt out of completing it.</p>"+
  "<p>Your goal is to complete 30 projects.</p>"+
  "<p>If you understand these instructions, please click OK.</p>",
  allow_keys: false,
  show_clickable_nav: true,
  post_trial_gap: 1000
};

/*sampling randomly without replacement*/

var test = {
  timeline: [
  {
    type: jsPsychHtmlButtonResponse,
    choices: ['Invest'],
    stimulus: function(data) {
      console.log(links.length);
      if (links.length == 0) {
        links = master_links.slice();
      }
      var randomindex = Math.floor(Math.random() * links.length);
      var randomlink = links.splice(randomindex, 1)[0];
      my_initial_link = randomlink[0];
      my_terminal_link = randomlink[1];
      var html = `<p>This project will take you ${my_initial_link} hours to set up.</p>` +
          `<p style="position: absolute; left:40px; top:20px; text-align: center">Projects Completed:</p>` +
          `<p style="position: absolute; left:40px; top:50px; text-align: center">${projects_completed}</p>` +
          `<p style="position: absolute; right:40px; top:20px; text-align: center">Hours Remaining:</p>` +
          `<p style="position: absolute; right:40px; top:50px; text-align: center">${hours_remaining}</p>`
      return html;
    },
    on_finish: function(data) {
      hours_remaining = hours_remaining - my_initial_link;
      investments_made = investments_made + 1;
      data.initial_link = my_initial_link;
      data.terminal_link = my_terminal_link;
      data.trial_type = 'initial';
      data.hours_remaining = hours_remaining;
      data.hours_invested = max_hours - hours_remaining;
      data.projects_completed = projects_completed;
      data.investments_made = investments_made;
    }
  },
  {
    type: jsPsychHtmlButtonResponse,
    choices: ['Invest', 'Pass'],
    stimulus: function(data) {
      var html = `<p>This project took you ${my_initial_link} hours to set up.</p>` +
          `<p>Do you want to complete this project for ${my_terminal_link} hours?</p>` +
          `<p style="position: absolute; left:40px; top:20px; text-align: center">Projects Completed:</p>` +
          `<p style="position: absolute; left:40px; top:50px; text-align: center">${projects_completed}</p>` +
          `<p style="position: absolute; right:40px; top:20px; text-align: center">Hours Remaining:</p>` +
          `<p style="position: absolute; right:40px; top:50px; text-align: center">${hours_remaining}</p>`
      return html;
    },
    on_finish: function(data) {
      data.initial_link = my_initial_link;
      data.terminal_link = my_terminal_link;
      data.trial_type = 'terminal';
      data.hours_remaining = hours_remaining;
      data.hours_invested = max_hours - hours_remaining;
      data.projects_completed = projects_completed;
      data.investments_made = investments_made;
      if (data.response == 0) {
        projects_completed = projects_completed + 1;
        hours_remaining = hours_remaining - my_terminal_link;
      }
    }
  }
  ],
  loop_function: function() {
    if (projects_completed == 30 || hours_remaining <5) {
      return false;
    } else {
      return true;
    }
  }
}

/*defining debriefing block*/
var debrief = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function() {
    var number_hours_invested = max_hours - hours_remaining;
    var proportion_investments = projects_completed / investments_made * 100;
    return "<p>You invested on <strong>" + investments_made + "</strong> trials.</p>" +
    "<p>You invested <strong>" + number_hours_invested + " hours</strong> of your time into projects.</p>"+
    "<p>Your proportion of investments relative to the total number of projects offered was <strong>" + proportion_investments + "%</strong>.</p>"+
    "<p>Press any key to return to the questionnaires. Thank you!</p>";
  }
};

/*set up experiment structure*/
var timeline = [];
timeline.push(welcome);
timeline.push(instructions);
timeline.push(test);
timeline.push(debrief);

/* Remove comment notation below if want to run in browser */
/*start experiment*/
jsPsych.run(timeline);
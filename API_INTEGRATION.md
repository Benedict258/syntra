Project{
// JavaScript Example: Reading Entities
// Filterable fields: name, status, product_name, product_type, category, description, document_content, document_source, target_markets, target_budget, launch_date, primary_goal, price, currency, signals, keywords, competitors, value_props, roi_forecast, top_regions, survey_kit, persona_fit_score, personas, feature_confusion, executive_summary, run_status, run_progress, last_run_date, confidence_score, problem, personas_input, pricing_info, target_geos, resources_notes, competitors_input
async function fetchProjectEntities() {
const response = await fetch(`/api/apps/68b1429bbb969dd2425fb6f7/entities/Project`, {
headers: {
'api_key': '80e9df8c8b4f40b38133913b387cce0a', // or use await User.me() to get the API key
'Content-Type': 'application/json'
}
});
const data = await response.json();
console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: name, status, product_name, product_type, category, description, document_content, document_source, target_markets, target_budget, launch_date, primary_goal, price, currency, signals, keywords, competitors, value_props, roi_forecast, top_regions, survey_kit, persona_fit_score, personas, feature_confusion, executive_summary, run_status, run_progress, last_run_date, confidence_score, problem, personas_input, pricing_info, target_geos, resources_notes, competitors_input
async function updateProjectEntity(entityId, updateData) {
const response = await fetch(`/api/apps/68b1429bbb969dd2425fb6f7/entities/Project/${entityId}`, {
method: 'PUT',
headers: {
'api_key': '80e9df8c8b4f40b38133913b387cce0a', // or use await User.me() to get the API key
'Content-Type': 'application/json'
},
body: JSON.stringify(updateData)
});
const data = await response.json();
console.log(data);
}
}

Creative {
// JavaScript Example: Reading Entities
// Filterable fields: project_id, channel, format, headline, body_copy, cta, predicted_performance, image_prompt, performance_rationale
async function fetchCreativeEntities() {
const response = await fetch(`/api/apps/68b1429bbb969dd2425fb6f7/entities/Creative`, {
headers: {
'api_key': '80e9df8c8b4f40b38133913b387cce0a', // or use await User.me() to get the API key
'Content-Type': 'application/json'
}
});
const data = await response.json();
console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: project_id, channel, format, headline, body_copy, cta, predicted_performance, image_prompt, performance_rationale
async function updateCreativeEntity(entityId, updateData) {
const response = await fetch(`/api/apps/68b1429bbb969dd2425fb6f7/entities/Creative/${entityId}`, {
method: 'PUT',
headers: {
'api_key': '80e9df8c8b4f40b38133913b387cce0a', // or use await User.me() to get the API key
'Content-Type': 'application/json'
},
body: JSON.stringify(updateData)
});
const data = await response.json();
console.log(data);
}
}
and so on chnages for: Artifact, Creative, ChecklistItem, SavedItem, AgileTask, BMC, Run JOb, Report

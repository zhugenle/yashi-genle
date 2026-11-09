(()=>{
'use strict';
const fallback=window.SAMPLE_DATA;
const loadApp=()=>{const script=document.createElement('script');script.src='app.js';script.defer=true;document.body.append(script);};
if(location.protocol==='http:'||location.protocol==='https:'){
 fetch('/api/v1/bootstrap',{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error('API '+response.status);return response.json();}).then(data=>{window.SAMPLE_DATA=data;window.RESEARCH_DATA_SOURCE='api';}).catch(error=>{window.SAMPLE_DATA=fallback;window.RESEARCH_DATA_SOURCE='snapshot';window.RESEARCH_BOOTSTRAP_ERROR=error.message;}).finally(loadApp);
}else{window.RESEARCH_DATA_SOURCE='snapshot';loadApp();}
})();

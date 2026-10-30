const BASE=import.meta.env.VITE_API_URL||'';
export function getToken(){return localStorage.getItem('nexa_token');}
export async function api(path,{method='GET',body,auth=true}={}){const headers={'Content-Type':'application/json'};if(auth&&getToken())headers.Authorization=`Bearer ${getToken()}`;const response=await fetch(`${BASE}/api${path}`,{method,headers,...(body?{body:JSON.stringify(body)}:{})});const json=await response.json().catch(()=>({message:'Unexpected server response'}));if(!response.ok)throw new Error(json.message||`Request failed (${response.status})`);return json.data;}

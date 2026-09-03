const BASE='https://api.mangadex.org';
const COVER='https://uploads.mangadex.org/covers';
const PROXY='/api/proxy?url=';
export const TAG_MAP={'action':'391b0423-d847-456f-aff0-8b0cfc03066b','romance':'423e2eae-a447-4741-a19f-6a07c62de58f','fantasy':'cdc58593-87dd-415e-bbc0-2ec27bf404cc','horror':'cdad7e68-1419-41dd-bdce-27753074a640','comedy':'4d32cc48-9f00-4cca-9b5a-a839f0764984','scifi':'256c8bd9-4904-4360-bf4f-508a76d67183','slice':'e5301a23-ebd9-49dd-a0cb-2add944c7fe9','sports':'69964a64-2f90-4d33-beeb-f3ed2875eb4c','mecha':'a1f53773-c69a-4ce5-8cab-fffcd90b1565','isekai':'ace04997-f6bd-436e-b261-779182193d3d','mystery':'ee968100-4191-4968-93d3-f82d72be7e46','historical':'a9cb0326-d6d2-4753-9a84-bd3d3c91a9d7'};
function coverUrl(i,f){if(!i||!f)return null;return PROXY+encodeURIComponent(COVER+'/'+i+'/'+f+'.512.jpg');}
function extractCover(m){const r=(m.relationships||[]).find(r=>r.type==='cover_art');return r&&r.attributes&&r.attributes.fileName?coverUrl(m.id,r.attributes.fileName):null;}
function extractAuthor(m){const r=(m.relationships||[]).find(r=>r.type==='author');return r&&r.attributes&&r.attributes.name?r.attributes.name:'Unknown';}
function getTitle(m){const t=m.attributes&&m.attributes.title?m.attributes.title:{};return t.en||t['ja-ro']||t.ja||Object.values(t)[0]||'Untitled';}
function getDesc(m){const d=m.attributes&&m.attributes.description?m.attributes.description:{};return d.en||Object.values(d)[0]||'No description.';}
function timeAgo(s){if(!s)return'Recently';const d=Date.now()-new Date(s).getTime();const mn=Math.floor(d/60000);const h=Math.floor(d/3600000);const dy=Math.floor(d/86400000);if(mn<60)return mn+'m ago';if(h<24)return h+'h ago';return dy+'d ago';}
function fmt(m,extra){extra=extra||{};return Object.assign({id:m.id,title:getTitle(m),author:extractAuthor(m),cover:extractCover(m),desc:getDesc(m),chapters:m.attributes&&m.attributes.lastChapter?m.attributes.lastChapter:'?',rating:((m.attributes&&m.attributes.rating&&m.attributes.rating.bayesian?m.attributes.rating.bayesian:0)).toFixed(1),views:'N/A',status:m.attributes&&m.attributes.status?m.attributes.status:'ongoing',tags:(m.attributes&&m.attributes.tags?m.attributes.tags:[]).map(function(t){return t.attributes&&t.attributes.name?t.attributes.name.en:null;}).filter(Boolean),updated:timeAgo(m.attributes&&m.attributes.updatedAt?m.attributes.updatedAt:null),isNew:false,isTrending:false,source:'mangadex'},extra);}
async function apiFetch(path){const url=PROXY+encodeURIComponent(BASE+path);const ctrl=new AbortController();const t=setTimeout(function(){ctrl.abort();},15000);try{const res=await fetch(url,{signal:ctrl.signal});clearTimeout(t);if(!res.ok)throw new Error('HTTP '+res.status);return await res.json();}catch(err){clearTimeout(t);throw err;}}
export async function fetchTrending(limit){limit=limit||20;try{const path='/manga?limit='+limit+'&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true&availableTranslatedLanguage[]=en';const data=await apiFetch(path);return(data.data||[]).map(function(m,i){return fmt(m,{isTrending:true,trendingRank:i+1});});}catch(err){console.warn('fetchTrending:',err.message);return[];}}
export async function fetchLatest(limit){limit=limit||20;try{const path='/manga?limit='+limit+'&order[latestUploadedChapter]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true&availableTranslatedLanguage[]=en';const data=await apiFetch(path);return(data.data||[]).map(function(m){return fmt(m,{isNew:true});});}catch(err){console.warn('fetchLatest:',err.message);return[];}}
export async function fetchByCategory(categoryId,limit){limit=limit||20;const tagId=TAG_MAP[categoryId];if(!tagId)return[];try{const path='/manga?limit='+limit+'&includedTags[]='+tagId+'&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true&availableTranslatedLanguage[]=en';const data=await apiFetch(path);return(data.data||[]).map(function(m){return fmt(m);});}catch(err){console.warn('fetchByCategory:',err.message);return[];}}
export async function searchManga(query,limit){limit=limit||20;if(!query||!query.trim())return[];try{const path='/manga?limit='+limit+'&title='+encodeURIComponent(query.trim())+'&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true';const data=await apiFetch(path);return(data.data||[]).map(function(m){return fmt(m);});}catch(err){console.warn('searchManga:',err.message);return[];}}
export async function fetchMangaDetail(mangaId){try{const data=await apiFetch('/manga/'+mangaId+'?includes[]=cover_art&includes[]=author');return fmt(data.data);}catch(err){console.warn('fetchMangaDetail:',err.message);return null;}}
export async function fetchChapters(mangaId,limit){
  limit=limit||96;
  try{
    const path='/manga/'+mangaId+'/feed?limit='+limit+'&translatedLanguage[]=en&order[chapter]=asc&contentRating[]=safe&contentRating[]=suggestive';
    const data=await apiFetch(path);
    const all=data.data||[];
    const readable=all.filter(function(ch){return !ch.attributes.externalUrl&&(ch.attributes.pages||0)>0;});
    const list=readable.length>0?readable:all;
    return list.map(function(ch){return{id:ch.id,num:ch.attributes.chapter||'?',title:ch.attributes.title||('Chapter '+(ch.attributes.chapter||'?')),pages:ch.attributes.pages||0,date:timeAgo(ch.attributes.publishAt),hasPages:!ch.attributes.externalUrl&&(ch.attributes.pages||0)>0};});
  }catch(err){console.warn('fetchChapters:',err.message);return[];}
}
export async function fetchChapterPages(chapterId){
  if(!chapterId)return{pages:[],total:0};
  try{
    const data=await apiFetch('/at-home/server/'+chapterId);
    const baseUrl=data.baseUrl;
    const hash=data.chapter&&data.chapter.hash?data.chapter.hash:'';
    const saver=data.chapter&&data.chapter.dataSaver?data.chapter.dataSaver:[];
    const hq=data.chapter&&data.chapter.data?data.chapter.data:[];
    if(!baseUrl||saver.length===0)return{pages:[],total:0};
    return{pages:saver.map(function(f,i){return{index:i+1,url:baseUrl+'/data-saver/'+hash+'/'+f,urlHQ:baseUrl+'/data/'+hash+'/'+(hq[i]||f)};}),total:saver.length};
  }catch(err){console.warn('fetchChapterPages:',err.message);return{pages:[],total:0};}
}
export async function fetchStats(mangaId){try{const data=await apiFetch('/statistics/manga/'+mangaId);const s=data.statistics&&data.statistics[mangaId]?data.statistics[mangaId]:null;return{rating:s&&s.rating&&s.rating.bayesian?s.rating.bayesian.toFixed(1):'N/A',follows:s&&s.follows?s.follows:0};}catch(e){return{rating:'N/A',follows:0};}}

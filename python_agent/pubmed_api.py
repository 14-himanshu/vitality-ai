import requests
import os

PUBMED_API_KEY = os.environ.get("PUBMED_API_KEY", "")
ESEARCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
ESUMMARY_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"

def search_pubmed(query: str) -> str:
    """
    Searches PubMed for medical studies related to the query and returns summaries.
    """
    try:
        # Step 1: Search for IDs
        search_params = {
            "db": "pubmed",
            "term": query,
            "api_key": PUBMED_API_KEY,
            "retmode": "json",
            "retmax": 2
        }
        search_res = requests.get(ESEARCH_URL, params=search_params, timeout=5.0)
        search_res.raise_for_status()
        search_data = search_res.json()
        
        id_list = search_data.get("esearchresult", {}).get("idlist", [])
        if not id_list:
            return f"No PubMed studies found for '{query}'."
            
        # Step 2: Fetch Summaries
        summary_params = {
            "db": "pubmed",
            "id": ",".join(id_list),
            "api_key": PUBMED_API_KEY,
            "retmode": "json"
        }
        summary_res = requests.get(ESUMMARY_URL, params=summary_params)
        summary_res.raise_for_status()
        summary_data = summary_res.json()
        
        result_str = f"PubMed Clinical Studies for '{query}':\n\n"
        uids = summary_data.get("result", {}).get("uids", [])
        
        for uid in uids:
            study = summary_data["result"][uid]
            title = study.get("title", "No title")
            pubdate = study.get("pubdate", "Unknown date")
            source = study.get("source", "Unknown journal")
            url = f"https://pubmed.ncbi.nlm.nih.gov/{uid}/"
            
            result_str += f"- Title: {title}\n"
            result_str += f"  Journal: {source} ({pubdate})\n"
            result_str += f"  Link: {url}\n\n"
            
        return result_str + "[Source: PubMed (NCBI E-utilities)]"
    except Exception as e:
        return f"Error fetching PubMed data: {e}"

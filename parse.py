import sys
from bs4 import BeautifulSoup

def extract_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')
    for script in soup(["script", "style", "meta", "noscript", "svg"]):
        script.extract()
    text = soup.get_text(separator='\n', strip=True)
    print(text)

if __name__ == "__main__":
    extract_text(sys.argv[1])

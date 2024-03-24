import asyncio
import aiohttp
from requests import get
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import json

class WebTeb:

    def __init__(self, chunk_length=2000):
        self.url = 'https://www.webteb.com'
        self.website = get(self.url).content
        self.content = BeautifulSoup(self.website, 'html.parser')
        self.spider_links = []
        self.scraped_entities = []
        self.chunk_length = chunk_length
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"
        options = webdriver.ChromeOptions()
        options.headless = True
        options.add_argument(f'user-agent={user_agent}')
        options.add_argument("--window-size=1920,1080")
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--allow-running-insecure-content')
        options.add_argument("--disable-extensions")
        options.add_argument("--proxy-server='direct://'")
        options.add_argument("--proxy-bypass-list=*")
        options.add_argument("--start-maximized")
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--no-sandbox')
        self.driver = webdriver.Chrome(options=options)
        self.article_page_number = 0
        self.counter = 1

    def get_article_page_number(self):
        url = f'{self.url}/articles'

        self.driver.get(url)
        self.driver.execute_script("window.scrollBy(0,document.body.scrollHeight)", "");

        page = self.driver.page_source
        content = BeautifulSoup(page, 'html.parser')
        pages_num = content.find('a', {'id': 'last-page-link'})['href'].split('=')[1]

        print(f'total pages under article path is : {pages_num} pages')

        self.article_page_number = int(pages_num)

    async def get_articles_page_articles(self, page_index, session):
        url = f'{self.url}/articles?pageindex={str(page_index)}'
        try:
            async with session.get(url) as r:
                if r.status != 200:
                    r.raise_for_status()
                website = await r.text()
                
                content = BeautifulSoup(website, 'html.parser')

                for article in content.find_all('div', {'class': 'item-box-cotainer'}):
                    category = article.find('a', {'class': 'category'}).find('span').text
                    if category == 'الصحة النفسية':
                        url = article.find_all('a')[1]['href']
                        print(self.counter, url)
                        self.counter += 1
                        self.spider_links.append(url)
                    else :
                        continue

        except Exception as e:
            print('Error here : ')
            print(e)

    async def save_articles_link(self, file_name=f'{(int(time.time() * 1000))}_webteb_articles_url.json'):

        # first we need to now total pages for articles
        self.get_article_page_number()

        task_length = self.article_page_number + 1

        tasks = []
        total_timeout = aiohttp.ClientTimeout(total=60 * 500)
        connector = aiohttp.TCPConnector(limit=60)
        semaphore = asyncio.Semaphore(300)
        async with semaphore:
            async with aiohttp.ClientSession(connector=connector, timeout=total_timeout) as session:
                
                for index in range(1, task_length):
                    while True:  # Keep retrying until task succeeds
                        try:
                            task = asyncio.create_task(self.get_articles_page_articles(index, session))
                            await task
                            break  # Task succeeded, exit loop
                        except Exception as e:
                            print(f"Error occurred: {e}. Retrying...")
                await asyncio.gather(*tasks)

            with open(file_name, 'w') as file:
                json.dump(self.spider_links, file, ensure_ascii=False)
                self.spider_links = []
    

    async def save_articles(self, file_name):
        with open(file_name) as json_file:
            links = json.load(json_file)
            tasks = []
            total_timeout = aiohttp.ClientTimeout(total=60 * 500)
            connector = aiohttp.TCPConnector(limit=30)
            semaphore = asyncio.Semaphore(300)
            async with semaphore:
                async with aiohttp.ClientSession(connector=connector, timeout=total_timeout) as session:
                    try:

                        for link in links:
                            task = asyncio.create_task(
                                self.get_target_article(link, session)
                                )
                            tasks.append(task)

                        await asyncio.gather(*tasks)
                    except Exception as e:
                        with open(f'{(int(time.time() * 1000))}_webteb_articles.json', 'w') as json_file:
                            json.dump(self.scraped_entities, json_file, ensure_ascii=False)
                        self.scraped_entities = []
                        print(e)
            if len(self.scraped_entities) > 0:
                with open(f'{(int(time.time() * 1000))}_webteb_articles.json', 'w') as json_file:
                    json.dump(self.scraped_entities, json_file, ensure_ascii=False)
                self.scraped_entities = []

    async def get_target_article(self, link, session):
        url = f'{link}'
        try:
            async with session.get(url) as r:
                if r.status != 200:
                    r.raise_for_status()
                website = await r.text()
                content = BeautifulSoup(website, 'html.parser')
                try:
                    title = content.find('ul', {'class': 'breadcrumb'}).find_all('li')[-1].text.strip()
                    article_content = content.find('div', {'id': 'abody'}).get_text(separator=' ').strip()
                    new_article = {"title": title,"url":link,"content": article_content}
                    print(self.counter, new_article)
                    self.counter += 1
                    self.scraped_entities.append(new_article)
                except Exception as e:
                    print('no article found.', e)
                if len(self.scraped_entities) == self.chunk_length:
                    with open(f'{(int(time.time() * 1000))}_webteb_articles.json', 'w') as json_file:
                        json.dump(self.scraped_entities, json_file, ensure_ascii=False)
                    self.scraped_entities = []
        except Exception as e:
            print(e)
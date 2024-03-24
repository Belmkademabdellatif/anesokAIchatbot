import asyncio
import aiohttp
from requests import get
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import json
import requests

class Altibbi:

    def __init__(self, chunk_length=2000):
        self.url = 'https://altibbi.com'
        self.website = get(self.url).content
        self.content = BeautifulSoup(self.website, 'html.parser')
        self.spider_links = []
        self.scraped_entities = []
        self.articles = {}
        self.question_links = []
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
        self.qAa_page_number = 0
        self.terms_page_number = 0
        self.counter = 1

    def get_page_number(self, target_path):
        
        url = f'{self.url}/{target_path}'
        print(url)

        page = requests.get(url).text
        content = BeautifulSoup(page, 'html.parser')
        
        last_page_link = content.find('li',{'class':'last'}).find('a')

        # Extract the page number from the href attribute
        if last_page_link:
            last_page_href = last_page_link.get('href')
            pages_num = int(last_page_href.split('=')[-1])
            print("Last Page Number:", pages_num)
        else:
            print("Last page link not found.")

        print(f'total pages under {target_path} path is : {pages_num} pages')


        if 'اسئلة-طبية' in target_path:
            self.qAa_page_number = int(pages_num)
        elif 'مقالات-طبية' in target_path :
            self.article_page_number = int(pages_num)
        elif 'مصطلحات-طبية' in target_path:
            self.terms_page_number = int(pages_num)

    async def get_page_questions_links(self, page_index, session):
        page_link = f'{self.url}/اسئلة-طبية/امراض-نفسية?page={str(page_index)}'
        
        print(page_link)
        try:
            async with session.get(page_link) as r:
                if r.status != 200:
                    r.raise_for_status()
                    
                website = await r.text()
                content = BeautifulSoup(website, 'html.parser')

                for question in content.find_all('article', {'class': 'new-question-item'}):
                    main_entity_div = question.find('div',{'itemprop':'mainEntity'})
                    if main_entity_div:
                        url = main_entity_div.find('a')['href']
                        print(self.counter, url)
                        self.spider_links.append(url)
                        self.counter += 1
                    else:
                        print('MainEntity div not found in article.')
        except Exception as e:
            print('Error here : ')
            print(e)

    async def get_articles_page_articles(self, page_index,path, session):
        url = f'{self.url}/{path}?page={str(page_index)}'
        
                
        try:
            async with session.get(url) as r:
                if r.status != 200:
                    r.raise_for_status()
                website = await r.text()
                content = BeautifulSoup(website, 'html.parser')

                for article in content.find_all('article', {'class': 'article-item-container'}):
                    url = f'{self.url}{article.find('a')['href']}'
                    print(self.counter,path, url)
                    self.counter += 1
                    self.spider_links.append(url)

        except Exception as e:
            print('Error here : ')
            print(e)
            
    async def get_page_terminologies_links(self, page_index,path, session):
        url = f'{self.url}/{path}?dp-1-page={str(page_index)}'
           
        try:
            async with session.get(url) as r:
                if r.status != 200:
                    r.raise_for_status()
                website = await r.text()
                content = BeautifulSoup(website, 'html.parser')

                for article in content.find_all('article', {'class': 'terms-item-wrapper'}):
                    potential_link = article.find('a')['href']
                    if potential_link:
                        url = f'{self.url}{potential_link}'
                        print(self.counter,path, url)
                        self.counter += 1
                        self.spider_links.append(url)

        except Exception as e:
            print('Error here : ')
            print(e)
    

    async def send_spider(self, path, page_index, session):
        if 'اسئلة-طبية' in path:
            await self.get_page_questions_links(page_index, session)
        elif 'مقالات-طبية' in path :
            await self.get_articles_page_articles(page_index,path, session)
        elif 'مصطلحات-طبية' in path:
            await self.get_page_terminologies_links(page_index,path, session)
            
    async def save_questions_link(self, file_name=f'{(int(time.time() * 1000))}_altibbi_questions_url.json'):
        await self.create_spider_tasks(file_name, 'اسئلة-طبية/امراض-نفسية')

    async def save_articles_link(self, file_name=f'{(int(time.time() * 1000))}_altibbi_articles_url.json'):
        await self.create_spider_tasks(file_name, 'مقالات-طبية/امراض-نفسية')
        await self.create_spider_tasks(file_name, 'مقالات-طبية/الامراض-العصبية')

    async def save_terminology_link(self, file_name=f'{(int(time.time() * 1000))}_altibbi_terminology_url.json'):
        await self.create_spider_tasks(file_name, 'مصطلحات-طبية/امراض-نفسية')
        await self.create_spider_tasks(file_name, 'مصطلحات-طبية/الامراض-العصبية')


    async def create_spider_tasks(self, file_name, path):
        # first we need to now total pages for articles
        self.get_page_number(path)

        print(f'current path is : {path}')
        print(f'current page total page : {self.qAa_page_number}')
        task_length = 0
        if 'اسئلة-طبية' in path:
            task_length = self.qAa_page_number + 1
        elif 'مقالات-طبية' in path :
            task_length = self.article_page_number + 1
        elif 'مصطلحات-طبية' in path:
            task_length = self.terms_page_number+1

        print(f'task length is : {task_length}')
        tasks = []
        total_timeout = aiohttp.ClientTimeout(total=60 * 500)
        connector = aiohttp.TCPConnector(limit=60)
        semaphore = asyncio.Semaphore(300)
        async with semaphore:
            async with aiohttp.ClientSession(connector=connector, timeout=total_timeout) as session:
                
                for index in range(1, task_length):
                    while True:  # Keep retrying until task succeeds
                        try:
                            task = asyncio.create_task(self.send_spider(path, index, session))
                            await task
                            break  # Task succeeded, exit loop
                        except Exception as e:
                            print(f"Error occurred: {e}. Retrying...")
                await asyncio.gather(*tasks)
            #  here it rewrite the file of previous result
            with open(file_name, '+a') as file:
                json.dump(self.spider_links, file, ensure_ascii=False)
                self.spider_links = []
    

    async def save_entities(self, entity_name, file_name):
        with open(file_name) as json_file:
            links = json.load(json_file)
            tasks = []
            total_timeout = aiohttp.ClientTimeout(total=60 * 500)
            connector = aiohttp.TCPConnector(limit=90)
            semaphore = asyncio.Semaphore(300)
            async with semaphore:
                async with aiohttp.ClientSession(connector=connector, timeout=total_timeout) as session:
                    try:
                        
                        for link in links:
                            task = asyncio.create_task(self.parse_entity(entity_name, link, session))
                            tasks.append(task)        

                        await asyncio.gather(*tasks)
                    except Exception as e:
                        with open(f'{(int(time.time() * 1000))}_altibbi_{entity_name}.json', 'w') as json_file:
                            json.dump(self.scraped_entities, json_file, ensure_ascii=False)
                        self.scraped_entities = []
                        print(e)
            if len(self.scraped_entities) > 0:
                with open(f'{(int(time.time() * 1000))}_altibbi_{entity_name}.json', 'w') as json_file:
                    json.dump(self.scraped_entities, json_file, ensure_ascii=False)
                self.scraped_entities = []

    async def parse_entity(self, entity_name, link, session):
        if entity_name == 'questions':
            await self.get_target_question(link, session)
        elif entity_name == 'articles':
            await self.get_target_article(link, session)
        elif entity_name == 'terms':
            await self.get_target_terminology(link,session)

    async def get_target_question(self, link, session):
        try:
            async with session.get(link) as r:
                if r.status != 200:
                    r.raise_for_status()
                website = await r.text()
                content = BeautifulSoup(website, 'html.parser')
                try:
                    question = content.find('header',{'itemprop':'name'}).text
                    answer = content.find('div',{'class':'doctor-answer'}).text
                    
                    qAa_dict = {"url":link,"question": question, "answer": answer}
                    self.scraped_entities.append(qAa_dict)
                    
                    print(self.counter, qAa_dict)
                    self.counter += 1
                except Exception as e:
                    print('no question found.', e)
                if len(self.scraped_entities) == self.chunk_length:
                    with open(f'{(int(time.time() * 1000))}_altibbi_questions.json', 'w') as json_file:
                        json.dump(self.scraped_entities, json_file, ensure_ascii=False)
                    self.scraped_entities = []
        except Exception as e:
            print(e)

    async def get_target_article(self, link, session):
        url = f'{link}'
        try:
            async with session.get(url) as r:
                if r.status != 200:
                    r.raise_for_status()
                website = await r.text()
                content = BeautifulSoup(website, 'html.parser')
                try:
                    title = content.find('h1', {'itemprop': 'headline'}).text.strip()
                    article_content = content.find('article', {'class': 'article-body'}).get_text(separator=' ').strip()
                    new_article = {"url":url,"title": title,"content": article_content}
                    print(self.counter, new_article)
                    self.counter += 1
                    self.scraped_entities.append(new_article)
                except Exception as e:
                    print('no article found.', e)
                if len(self.scraped_entities) == self.chunk_length:
                    with open(f'{(int(time.time() * 1000))}_altibbi_articles.json', 'w') as json_file:
                        json.dump(self.scraped_entities, json_file, ensure_ascii=False)
                    self.scraped_entities = []
        except Exception as e:
            print(e)
    
    async def get_target_terminology(self, link, session):
        url = f'{link}'
        try:
            async with session.get(url) as r:
                if r.status != 200:
                    r.raise_for_status()
                website = await r.text()
                content = BeautifulSoup(website, 'html.parser')
                try:
                    title = content.find('h1', {'class': 'term__heading'}).text.strip()
                    definition = content.find('div',{'class':'term__body'}).get_text(separator=' ').strip()
                    new_record = {"url":link,"title": title, "definition": definition}
                    print(self.counter, new_record)
                    self.counter += 1
                    self.scraped_entities.append(new_record)
                except Exception as e:
                    print('no terminology found.', e)
                if len(self.scraped_entities) == self.chunk_length:
                    with open(f'{(int(time.time() * 1000))}_altibbi_terminologies.json', 'w') as json_file:
                        json.dump(self.scraped_entities, json_file, ensure_ascii=False)
                    self.scraped_entities = []
        except Exception as e:
            print(e)        
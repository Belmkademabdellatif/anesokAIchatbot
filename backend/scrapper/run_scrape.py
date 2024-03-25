#  targeted pages
# [https://www.webteb.com]
# [https://altibbi.com]

# webteb has articles about mental-health
# altibbi has Q&A , articles and terminology about mental-health

# the total number of article form webteb are : 439
# the total number of articles form alibiti are : 305
# the total number of questions form alibiti are : 7932
# the total number of terms form alibiti are : 792


# import asyncio
import time
# from scrapper.webteb import WebTeb
# from scrapper.altibbi import Altibbi
import json

start = time.perf_counter()
# webteb = WebTeb()

# if you want to get articles from webteb run this first 
# asyncio.run(webteb.save_articles_link())
# then take the generated file name and pass it to this function
# asyncio.run(webteb.save_articles('./dataset/urls/1711003381125_webteb_articles_url.json'))


# altibbi = Altibbi()

# if you want to get questions from altibbi run this first 
# asyncio.run(altibbi.save_questions_link())
# then take the generated file name and pass it to this function
# asyncio.run(altibbi.save_entities('questions','./dataset/urls/1710960394707_altibbi_questions_url.json'))


# if you want to get articles from altibbi run this first 
# asyncio.run(altibbi.save_articles_link())
# then take the generated file name and pass it to this function
# asyncio.run(altibbi.save_entities('articles','./dataset/urls/1711027999921_altibbi_articles_url.json'))


# if you want to get terminology from altibbi run this first 
# asyncio.run(altibbi.save_terminology_link())
# then take the generated file name and pass it to this function
# asyncio.run(altibbi.save_entities('terms','./dataset/urls/1711029168839_altibbi_terminology_url.json'))


stop = time.perf_counter()
print("time taken:", stop - start)
    
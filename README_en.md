
<h1 align="center">Anesok انيسُك</h1>

<div align="center">
 <img src="https://github.com/Faris-abukhader/anesokAIchatbot/assets/70070951/59ce8aae-086c-4af5-bf9c-a87a3a137dff" width="200" height="200" style="padding-right:15px"/>
</div>
                                                                                                                


## 🚩 Table of Contents 

- [Introduction](#--introduction)
- [Models and Graphs](#--models-and-graphs)
- [Downloading the Repository](#--downloading-the-repository)
- [Project Setup](#--project-setup)
- [License](#-license)



## <img src="https://cdn-icons-png.flaticon.com/512/1436/1436664.png" width="25" height="25" style="padding-right:15px"> Introduction 

<p>
As a student in software engineering from the Arab world, my journey took an unexpected turn when I found myself studying in China amid the chaos of the COVID-19 pandemic. The closures in a foreign country with an unfamiliar language and culture had a profound impact on my mental well-being, and I witnessed despair in many international students, including a dear colleague, silently battling deep depression.

Tragically, the burdens of the pandemic became too heavy for my colleague to bear, and he succumbed to darkness, leaving behind a void that could never be filled. This departure shook me to the core and ignited a fire within me to do something - to prevent others from feeling the same despair and to provide a lifeline to those drowning in silence.

Amidst this sorrow and determination, the idea of an AI-powered chatbot specifically designed for Arab youth struggling with mental health challenges was born. I realized that the stigma surrounding mental illnesses in our communities often prevents individuals from seeking the desperately needed help. I learned that we need to find a solution that can bridge this gap and provide easily accessible support for those suffering in silence.

Our chatbot is more than just a project - it is a lifeline, born from the depths of personal struggle. It is a beacon of hope for Arab youth navigating the complexities of modern life, offering understanding and guidance in their darkest moments.

Through this project, I am committed to honoring the memory of my colleague by turning tragedy into triumph, by channeling grief into action, and by creating a legacy of compassion and support for future generations. Let us rewrite the narrative surrounding mental health in Arab communities. Let us break the silence, erase the stigma, and build a future where no one suffers alone.

This is more than just a project - it is a promise to save lives, to offer hope, and to shine a light in the darkest of times. Join me on this journey as we turn pain into hope and make a difference in the lives of Arab youth worldwide.
</p>

## <img src="https://cdn-icons-png.flaticon.com/512/814/814848.png" width="25" height="25" style="padding-right:15px">  Corrective Retrieval-Augmented Generation (CRAG)



<div>
<img src='https://github.com/Faris-abukhader/anesokAIchatbot/blob/main/RAG.png?raw=true'/>
</div>

<p>
Introduction to RAG:

Retrieval-Augmented Generation (RAG) technology represents a revolutionary advancement in natural language processing, seamlessly integrating retrieval-based techniques with generative AI models. By harnessing the strengths of both approaches, RAG enables AI systems to provide contextually accurate responses akin to human fluency.

The Need for CRAG:

Despite the remarkable capabilities of RAG, challenges arise when retrieved results contain inaccurate information, leading to the generation of misinformation by AI language models. In response to this need for improved accuracy and reliability, Corrective Retrieval-Augmented Generation (CRAG) technology emerges as a solution. CRAG aims to automatically correct retrieval results and enhance document usage for generation, ensuring the delivery of accurate and reliable responses.

How CRAG Works:

<div>
<img src='https://github.com/Faris-abukhader/anesokAIchatbot/blob/main/CRAG.png?raw=true'/>
</div>
<br/>

CRAG employs a multifaceted approach to enhance the efficacy of generation processes. It incorporates a lightweight retrieval scorer to evaluate the quality of retrieved documents. In cases of incorrect or ambiguous retrieval results, CRAG strategically integrates web search processes to supplement retrieved information. Additionally, CRAG utilizes document analysis and rephrasing algorithms to filter retrieved documents, focusing on key information and eliminating irrelevant details. This iterative process improves the utilization of retrieved data, resulting in contextually accurate and appropriate responses.

</p>


## <img src="https://cdn-icons-png.flaticon.com/512/814/814848.png" width="25" height="25" style="padding-right:15px">  Downloading the Repository  

### 🔘 Copying the Project Repository 
1. Go to the project's main page.
2. Click on the "code" button at the top of the page.
3. Copy the repository link.
4. Open the terminal on your device.
5. Navigate to the directory where you want to download the project.
6. Enter the following command to copy the project repository to your computer:


```
git clone github.com/Faris-abukhader/anesokAIchatbot
```

Press enter to complete the process

```
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
> Cloning into `anesokAIchatbot`...
> remote: Counting objects: 10, done.
> remote: Compressing objects: 100% (8/8), done.
> remove: Total 10 (delta 1), reused 10 (delta 1)
> Unpacking objects: 100% (10/10), done.
```
<br/>




### 🔘 Setting Up Secret Keys (.env) 

## For the Frontend UI 

Navigate to the directory: 

```
cd frontend
```

Rename the env.example file to .env

```
mv .env.example .env
```

Place your secret keys there and save the changes 

## For the Backend Server  

Navigate to the server directory:

 ```
 cd ..
 cd backend
 ```

Rename the env.example file to .env

```
mv .env.example .env
```

Place your secret keys there and save the changes 


<br/>


## <img src="https://cdn-icons-png.flaticon.com/512/814/814848.png" width="25" height="25" style="padding-right:15px">  Project Setup 

To set up the project, you need to download NodeJs & python on your computer, if you already have it make sure it's the latest version.

### 🔘 Checking NodeJs Version

```
node -v
```

### 🔘 Checking Python Version
 
```
python3 --version
```

<br/>


### 🔘 Downloading NodeJs


> For Windows Users
- You can download the Windows version through the official NodeJs page, make sure to download the latest available version.
 [Official Page](https://nodejs.org/en/download/)

<br/>

> For Mac Users 
- NodeJs can be downloaded via brew commands 

```
brew install node
```
- You can also download the Mac version through the [Official Page](https://nodejs.org/en/download/)

<br/>

### 🔘 Downloading Python


> For Windows Users
- You can download the Windows version through the official Python page, make sure to download the latest available version.
 [Official Page](https://www.python.org/downloads/)

<br/>

> For Mac Users 
- Python can be downloaded via brew commands 


```
brew install python
```

- You can also download the Mac version through the [Official Page](https://www.python.org/downloads/)


<hr/>


### 🔘 Downloading Necessary Libraries 

To download the server code libraries, navigate to the server directory and enter the command:

```
pip install -r requirements.txt
```

To download the frontend libraries, navigate to the project directory and enter the command:

```
pnpm install 
```


To run the backend server, enter the following command:

```
uvicorn server:server --reload
```

To run the frontend, enter the following command: 

```
pnpm dev
```

<br/>
<hr/>

## 📜 License

This project is under the [MIT License](https://github.com/Faris-abukhader/anesokAIchatbot/blob/main/LICENSE) © [FaRiS](https://github.com/Faris-abukhader).

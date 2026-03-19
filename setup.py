from setuptools import setup, find_packages

setup(
    name="vhack_engine",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "mesa",
        "ollama",
        "pymongo",
        "python-dotenv",
        "fastapi",
        "uvicorn",
        "networkx",
        "langchain>=0.3.0",
        "langchain-community>=0.3.0",
        "langchain-ollama>=0.2.0",
        "chromadb>=0.5.0",
        "mcp>=1.0.0",
    ],
)
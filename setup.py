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
    ],
)
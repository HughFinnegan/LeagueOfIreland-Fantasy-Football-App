from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import *
import csv
import re

import time

SELECTOR = 0
CLASS = 1
XPATH = 2
ID = 3
TAG = 4

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 5)

def waitAndFind(source, name, type):
    if type == SELECTOR:
        return wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, name)))
    elif type == CLASS:
        return wait.until(EC.presence_of_element_located((By.CLASS_NAME, name)))
    elif type == XPATH:
        return wait.until(EC.presence_of_element_located((By.XPATH, name)))
    elif type == ID:
        return wait.until(EC.element_to_be_clickable((By.ID, name)))
    elif type == TAG:
        return wait.until(EC.presence_of_element_located((By.TAG_NAME, name)))

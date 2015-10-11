__author__ = 'alex'
from world import World, Body, Polygon
# import matplotlib.pyplot as plt
import math
import numpy as np
from flask import Flask
from flask_sockets import Sockets
from world import World, Body, Polygon
import random, time
import math
import threading
import gevent


# i = 0
#
# def w(a):
#     print a
#
# def qwerty():
#     global i
#     while True:
#         gevent.spawn(w, 'qwerty' + str(i))
#         i += 1
#         gevent.sleep(0.02)
#
# gevent.spawn(qwerty)
# print '1'
# gevent.sleep(5.0)

import redislite
import json
#
r = redislite.StrictRedis()
m = {}
ar = 1234567890.0


print 'redis'
start = time.time()

for i in range(10000):
    r.set(str(i), ar + i)
for i in range(10000):
    ar2 = r.get(str(i))
    # ar2 *= 2

print time.time() - start


print 'dict'
start = time.time()

for i in range(10000):
    m[str(i)] = ar + i
for i in range(10000):
    ar2 = m.get(str(i))
    # ar2 *= 2

print time.time() - start
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))  # Asegura que backend/ esté en el path


from app import create_app

app = create_app()

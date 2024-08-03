from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)

df = pd.read_excel("online_retail_II.xlsx")
df.drop(columns=['Invoice','StockCode','Quantity','InvoiceDate','Price'],inplace=True)
description_to_id = {description: idx for idx, description in enumerate(df['Description'].unique(), start=1)}
df['Product ID'] = df['Description'].map(description_to_id)
df.drop(columns=['Description','Country'],inplace=True)
df.drop_duplicates()
df['Product ID'] = df['Product ID'] % 80
df.drop_duplicates()
customer_product_matrix = df.pivot_table(index='Customer ID', columns='Product ID', aggfunc='size', fill_value=0)

# Train KNN model
knn = NearestNeighbors(metric='cosine', algorithm='brute')
knn.fit(customer_product_matrix)


def convert_to_history_matrix(history, size=80):
    history_matrix = np.zeros(size)
    for product_id in history:
        if product_id < size:  # Ensure product_id is within bounds of history_matrix
            history_matrix[product_id] += 1  # Increment count for the product_id
    return history_matrix


# Function to get recommendations
def get_recommendations(customer_id, n_neighbors=2,history=None):
    history_matrix = convert_to_history_matrix(history)
    distances, indices = knn.kneighbors([history_matrix], n_neighbors=n_neighbors + 1)
    similar_customers = customer_product_matrix.iloc[indices.flatten()].index
    similar_customers = similar_customers[similar_customers != customer_id]
    
    recommended_products = set()
    for similar_customer in similar_customers:
        recommended_products.update(df[df['Customer ID'] == similar_customer]['Product ID'].values)
    
    # Exclude products already purchased by the customer
    already_purchased = history
    recommended_products = recommended_products - set(already_purchased)

    recommendations = list(recommended_products)
    recommendations = [int(product_id) for product_id in recommendations]  
    
    return recommendations


# Flask API endpoint to get recommendations
@app.route('/recommendations', methods=['POST'])
def recommendations():
    data = request.get_json()
    print(data)
    customer_id = data['customer_id']
    history = data['history']
    recommendations = get_recommendations(customer_id, history=history)
    return jsonify({'recommendations': recommendations})

if __name__ == '__main__':
    app.run(debug=True)

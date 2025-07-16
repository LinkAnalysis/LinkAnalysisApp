import networkx as nx
import random

def generate_random_graph(num_of_nodes, num_of_edges, edge_file, node_file):
    G = nx.gnm_random_graph(num_of_nodes, num_of_edges)

    for u, v in G.edges():
        G[u][v]['weight'] = random.randint(1, 10)
        G[u][v]['label'] = f"Edge {u}-{v}"

    edge_lines = ["x,y,edgeWeight,edgeLabel"]
    for u, v in G.edges():
        edge_lines.append(f"{u},{v},{G[u][v]['weight']},{G[u][v]['label']}")
    with open(edge_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(edge_lines))

    node_lines = ["id,Description"]
    for node in G.nodes():
        node_lines.append(f"{node},Node {node}")
    with open(node_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(node_lines))

generate_random_graph(10, 20, 'random_edge.csv', 'random_node.csv')

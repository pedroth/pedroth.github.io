#include <iostream>
#include <vector>
//#include <fstream>

#define INT_MAX 32767

int min(int a, int b) {
	if (a < b) {
		return a;
	}
	else {
		return b;
	}
}

int max(int a, int b) {
	if (a < b) {
		return b;
	}
	else {
		return a;
	}
}

class Vertex {
private:
	int _id;

public:
	Vertex(int id) : _id(id) {}


	int getId() {
		return _id;
	}

	void setId(int id) {
		_id = id;
	}
};

class Edge {
private:
	int _u;
	int _id;
	int _capacity;
	int _flow;

public:
	Edge(int id, int capacity) :_id(id), _capacity(capacity), _flow(0) { }

	Edge() { }

	int getId() {
		return _id;
	}

	void setId(int id) {
		_id = id;
	}

	int getCapacity() {
		return _capacity;
	}

	void setCapacity(int capacity) {
		_capacity = capacity;
	}

	int getFlow() {
		return _flow;
	}

	void setFlow(int flow) {
		_flow = flow;
	}

	int getU() {
		return _u;
	}

	void setU(int u) {
		_u = u;
	}
};

class GraphList {
private:
	std::vector<std::vector<Edge * > * > * _G;
	std::vector<std::vector<Edge * > * > * _rN;
	int _nVertices;
	int _nEdges;
	std::vector<Vertex * >  * _V;
	/*
	id's of source and target must be the two last ones, respectivelly
	*/
	Vertex  * _source, *_target;
public:
	GraphList()
		:_G(new  std::vector<std::vector<Edge *> * >),
		_rN(new std::vector<std::vector<Edge *> * >),
		_nVertices(),
		_nEdges(),
		_V(new std::vector<Vertex *>)
	{ }



	void addVertex() {
		_V->push_back(new Vertex(_nVertices));
		_G->push_back(new std::vector<Edge *>());
		_rN->push_back(new std::vector<Edge *>());
		_nVertices++;
	}

	/**
	*
	* @param u
	*            = id of vertex
	* @param v
	*            = id of vertex
	* @param c
	*            = capacity of the edge
	*/
	void addEdge(int u, int v, int c) {
		std::vector<Edge *> *  e = _G->at(u);
		Edge* vaux = new Edge(v, c);
		vaux->setU(u);
		e->push_back(vaux);

		e = _rN->at(u);
		vaux = new Edge(v, c);
		vaux->setU(u);
		e->push_back(vaux);

		e = _rN->at(v);
		vaux = new Edge(u, 0);
		vaux->setU(v);
		e->push_back(vaux);
		_nEdges++;
	}

	std::vector<Vertex * > * getVertexs() {
		return _V;
	}

	std::vector<Edge * > *  getAdjacentVertexs(int v) {
		return _G->at(v);
	}

	void print() {
		for (int i = 0; i < _nVertices; i++) {
			std::vector<Edge * > *  adj = _G->at(i);
			std::cout << i << ":\t";
			for (size_t j = 0; j < adj->size(); j++) {
				std::cout << adj->at(j)->getId() << " ( " << adj->at(j)->getFlow() << " | " << adj->at(j)->getCapacity() << " )  \t";
			}
			std::cout << std::endl;
		}
	}

	void maxFlux() {
		std::vector<Edge * > *  p = NULL;
		while ((p = findAugmentingPath()) != NULL) {
			// min flux of the augmenting path
			int cp = 1;
			for (size_t i = 0; i < p->size(); i++) {
				Edge * ef = p->at(i); // edge of residual graph
				if (ef == NULL)
					continue;
				Edge * e = findEdge(ef->getU(), ef->getId()); // edge of the
				// graph
				if (e != NULL) {
					e->setFlow(e->getFlow() + cp);
					ActualizeCf(ef);
				}
				else {
					e = findEdge(ef->getId(), ef->getU());
					e->setFlow(e->getFlow() - cp);
					ActualizeCf(ef);
				}
			}
		}
		delete p;
	}

	/**
	* find augmenting path on residual network
	*
	* @return std::vector of edges of residual network
	*/
	std::vector<Edge * >* findAugmentingPath() {
		int const size = _nVertices;
		bool * color = new bool[size];

		for (int i = 0; i < size; i++) {
			color[i] = false;
		}

		std::vector<Edge *> * ans = new std::vector<Edge *>();
		std::vector<int> stack;
		stack.push_back(_source->getId());
		while (!stack.empty()) {
			int v = stack.back();
			stack.pop_back();
			color[v] = true;
			if (v == _target->getId()) {
				delete color;
				return ans;
			}
			std::vector<Edge * >* adj = _rN->at(v);
			int n = adj->size();
			for (int i = 0; i < n; i++) {
				if (adj->at(i)->getCapacity() > 0
					&& !color[adj->at(i)->getId()]) {
					stack.push_back(adj->at(i)->getId());
				}
			}
			if (!stack.empty()) {
				Edge * aux = findResidualEdge(v, stack.back());
				ans->push_back(aux);
			}
		}
		delete color;
		delete ans;
		return NULL;
	}

	/**
	*
	* @param p
	*            path on residual network
	* @return min capacity of p
	*/
	int minCapacity(std::vector<Edge> p) {
		int minValue = INT_MAX;
		for (size_t i = 0; i < p.size(); i++) {
			minValue = min(minValue, 0);
		}
		return minValue;
	}

	/**
	*
	* @param u
	* @param v
	* @return edge (u,v) on the graph
	*/
	Edge*  findEdge(int u, int v) {
		std::vector<Edge *> * e = _G->at(u);
		for (size_t i = 0; i < e->size(); i++) {
			if (e->at(i)->getId() == v) {
				return e->at(i);
			}
		}
		return NULL;
	}

	/**
	*
	* @param u
	* @param v
	* @return edge (u,v) on the residual network
	*/
	Edge *  findResidualEdge(int u, int v) {
		std::vector<Edge *> * e = _rN->at(u);
		for (size_t i = 0; i < e->size(); i++) {
			if (e->at(i)->getId() == v) {
				return e->at(i);
			}
		}
		return NULL;
	}

	/**
	* ef : edge of residual network being actualized
	*
	*/
	void ActualizeCf(Edge * ef) {
		int u = ef->getU();
		int v = ef->getId();
		Edge * e = findEdge(u, v);
		if (e != NULL) {
			ef->setCapacity(e->getCapacity() - e->getFlow());
			Edge * re = findResidualEdge(v, u);
			re->setCapacity(e->getFlow());
		}
		else if ((e = findEdge(v, u)) != NULL) {
			ef->setCapacity(e->getFlow());
			Edge * re = findResidualEdge(v, u);
			re->setCapacity(e->getCapacity() - e->getFlow());
		}
		else {
			ef->setCapacity(0);
		}
	}

	/**
	*
	* @return Sum(t,v) for every v : v belongs to Adj(t), and t,v are in
	*         the residual network;
	*/
	int maxFluxAnswer() {
		int ans = 0;
		std::vector<Edge *> * adj = _rN->at(_target->getId());
		for (size_t i = 0; i < adj->size(); i++) {
			ans += adj->at(i)->getCapacity();
		}
		return ans;
	}

	void addFluxBidirectionalEdgeSpecial(int u, int v) {
		addEdge(u, v, 1);
		addVertex();
		addEdge(v, _nVertices - 1, 1);
		addEdge(_nVertices - 1, u, 1);
	}

	GraphList * copy() {
		GraphList * g = new GraphList();
		for (size_t i = 0; i < _V->size(); i++) {
			g->addVertex();
		}
		std::vector<Vertex*> * vertex = g->getVertexs();
		for (size_t i = 0; i < vertex->size(); i++) {
			Vertex * v = vertex->at(i);
			std::vector<Edge * > * adj = this->getAdjacentVertexs(v->getId());
			for (size_t j = 0; j < adj->size(); j++) {
				Edge * edg = adj->at(j);
				g->addEdge(edg->getU(), edg->getId(), edg->getCapacity());
			}
		}
		return g;
	}

	/*
	@param v
	is the id of the vertex that will be connected the source
	*/
	void addSpecialSource(int v) {
		addVertex();
		_source = _V->at(_nVertices - 1);
		addEdge(_source->getId(), v, INT_MAX);
	}
	/*
	@param v
	integer array that contains problematic nodes
	@size
	length of v
	@param source
	id of the vertex connected to source
	*/
	void addSpecialTarget(int* v, int size, int sourceCon) {
		addVertex();
		_target = _V->at(_nVertices - 1);
		for (int i = 0; i < size; i++) {
			if (v[i] != sourceCon) {
				addEdge(v[i], _nVertices - 1, INT_MAX);
			}
		}
	}

	bool isConnected(int init) {
		int const size = _nVertices;
		bool * color = new bool[size];

		for (int i = 0; i < size; i++) {
			color[i] = false;
		}
		std::vector<int> stack;
		stack.push_back(init);
		while (!stack.empty()) {
			int v = stack.back();
			stack.pop_back();
			color[v] = true;
			std::vector<Edge * >* adj = _G->at(v);
			int n = adj->size();
			for (int i = 0; i < n; i++) {
				if (!color[adj->at(i)->getId()]) {
					stack.push_back(adj->at(i)->getId());
				}
			}
		}
		int ans = 0;
		for (int i = 0; i < size; i++) {
			if (color[i]) {
				ans++;
			}
		}
		delete color;
		return ans == size;
	}

	int getAnswer(int* v, int size, int source) {
		int minFlow = INT_MAX;
		for (int i = 0; i < size; i++) {
			if (v[i] != source) {
				Edge * e = findEdge(v[i], _target->getId());
				minFlow = min(minFlow, e->getFlow());
			}
		}
		return minFlow;
	}

	int getAnswerConnect(int* v, int size, int source) {
		int minFlow = INT_MAX;
		for (int i = 0; i < size; i++) {
			if (v[i] != source) {
				Edge * e = findEdge(v[i], _target->getId());
				if (e->getFlow() != 0) {
					minFlow = min(minFlow, e->getFlow());
				}
			}
		}
		return minFlow;
	}

	~GraphList() {
		delete _V;
		delete _G;
		delete _rN;
	}
};

int main() {
	/*std::ifstream file;

	file.open("../../AsaProj4/proj2Testes/05/input");
	if (file.fail()) {
	std::cout << "Error loading nff: unable to open the file " << "blabla" << std::endl;
	exit(0);
	}*/

	int * ans;
	int numPoints, numConnections, numOfProblems;
	std::cin >> numPoints >> numConnections;
	GraphList * graph = new GraphList();
	for (int i = 0; i < numPoints; i++) {
		graph->addVertex();
	}
	for (int i = 0; i < numConnections; i++) {
		int u, v;
		std::cin >> u >> v;
		graph->addFluxBidirectionalEdgeSpecial(u, v);
	}
	std::cin >> numOfProblems;
	ans = new int[numOfProblems];
	for (int i = 0; i < numOfProblems; i++) {
		int numberOfNodes;
		std::cin >> numberOfNodes;
		int * problematicNode = new int[numberOfNodes];
		for (int j = 0; j < numberOfNodes; j++) {
			std::cin >> problematicNode[j];
		}

		GraphList * g = graph->copy();
		bool isConnected = g->isConnected(problematicNode[0]);
		g->addSpecialSource(problematicNode[0]);
		g->addSpecialTarget(problematicNode, numberOfNodes, problematicNode[0]);
		g->maxFlux();
		//g->print();
		if (isConnected) {
			ans[i] = g->getAnswerConnect(problematicNode, numberOfNodes, problematicNode[0]);
		}
		else {
			ans[i] = g->getAnswer(problematicNode, numberOfNodes, problematicNode[0]);
		}
		
		delete problematicNode;
		delete g;
	}
	for (int i = 0; i < numOfProblems; i++) {
		std::cout << ans[i] << std::endl;
	}
}
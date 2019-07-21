class Node {
	constructor (key) {
		this.key = key;
		this.left = null;
		this.right = null;
	}
}

class BinaryTree {
	constructor (arg) {
		if (arg) {
			var argType = Object.prototype.toString.call(arg);
			if (argType != '[object Array]') {
				if (String(arg) != arg) {
					throw new Error('constructor\'s params expected string, number, empty or array, but got ' + argType);
				} else {
					arg = [arg];
				}
			}
			arg.forEach((v, k) => {
				this.insert(v);
			})
		}
	}

	/*
	* @method _inserNode 向树中插入值的比较方法
	* @params root [Node] 当前被比较的节点
	* @params node [Node] 待插入的节点
	*/
	_insertNode (root, node) {
		if (node.key < root.key) { 	// 插入左树
			if (root.left == null) {
				root.left = node;
			} else {
				this._insertNode(root.left, node);
			}
		} else if (node.key > root.key){	// 插入右树
			if (root.right == null) {
				root.right = node;
			} else {
				this._insertNode(root.right, node);
			}
		}
	}

	/*
	* @medhod insert 向树中插入新数据
	* @params key [node] 将要被插入的值 
	*/
	insert (key) {
		var node = new Node(key);	// 每一个插人的值都是一个节点
		if (this._root == null) {
			this._root = node;
		} else {
			this._insertNode(this._root, node);
		}
	}

	/*
	* method _execTravers 遍历的递归算法
	* @params node [Node] 当前被遍历的节点对象
	* @params pos [string: [pre, mid, back]]	前中后序遍历的位置
	* @params result [array] 结果集，用来保存遍历后的数据
	*/
	_execTravers (node, pos, result) {
		pos == 'pre' && result.push(node.key);
		node.left && this._execTravers(node.left, pos, result);
		pos == 'mid' && result.push(node.key);
		node.right && this._execTravers(node.right, pos, result);
		pos == 'back' && result.push(node.key);
	}

	/*
	* @method travers 遍历
	* @params pos [string: [pre, mid, back]]	前中后序遍历
	*/
	travers (pos) {
		var result = [];
		this._execTravers(this._root, pos, result);
		return result;
	}

	/*
	* @method _execSearch 查找左右子树的边
	* @params node [Node] 当前被查找的节点
	* @params type [string: [left, right]]  查找左边或者右边
	* @params callbacs [function] 找到最左或者最右的节点后的回调函数，回调参数为查找到的节点
	*/
	_execSearch (node, type, callback) {
		if (node[type]) {
			return this._execSearch(node[type], type, callback);
		} else {
			callback && callback(node);
			return node.key;
		}
	}

	/*
	* @method min 当前树中的最小值
	*/
	min () {
		if (this._root) {
			return this._execSearch(this._root, 'left');
		} return 'no tree';
	}

	/*
	* @method max 当前树中的最小值
	*/
	max () {
		if (this._root) {
			return this._execSearch(this._root, 'right');
		} return 'no tree'
	}

	/*
	* @method _execFind 执行查找
	* @params node [Node] 当前被比较的节点
	* @params key [Node.key] 当前查找的值
	*/
	_execFind (node, key) {
		if (node == null) return node;

		if (key < node.key) {
			return this._execFind(node.left, key);
		} else if (key > node.key) {
			return this._execFind(node.right, key);
		} else if (key == node.key) {
			return node;
		}
	}

	/*
	* @method find 查找
	* @params key [Node.key] 当前查找的值
	*/
	find (key) {
		return this._execFind(this._root, key);
	}

	_findMin (node) {
		if (node) {
			while (node && node.left !== null) {
				node = node.left;
			}
		}
		return node;
	}
	/*
	* @method _execRmove 执行删除
	* @params node [Node] 当前执行的节点
	* @params key [Node.key] 需要被删除的值
	*/
	_execRmove (node, key) {
		if (node == null) return node;
		if (key < node.key) {
			node.left = this._execRmove(node.left, key);
		} else if (key > node.key) {
			node.right = this._execRmove(node.right, key);
		} else {
			// 当前节点是叶节点
			if (!(node.left || node.right)) {
				node = null;
			} else if (node.left == null) {	// 当前节点只有右树
				node = node.right;
			} else if (node.right == null) {	// 当前节点只有左树
				node = node.left
			} else {	// 左右都有，需要找到右树中的最小值,赋予当前node

				var _this = this;
				var minKey = this._execSearch(node.right, 'left', function (sNode) {
					node.right = _this._execRmove(node.right, sNode.key);	// 删除查找到的最小值	
				});

				node.key = minKey;	// 将最小值赋予当前节点
			}
		}
		return node;
	}
	remove (key) {
		return this._execRmove(this._root, key);
	}
}

void function useExample (argument) {
	var bt = new BinaryTree([5, 9]);
	var map = [8, 3, 10, 1, 6, 14, 4, 7, 13];

	map.forEach((v, k) => {
		bt.insert(v);
	})

	console.log(bt);
	console.log('pre', bt.travers('pre'));
	console.log('mid', bt.travers('mid'));
	console.log('back', bt.travers('back'));
	console.log(bt.min(), bt.max());
	console.log(bt.find(14));
	bt.remove(9);
	console.log('pre', bt.travers('pre'));
}()
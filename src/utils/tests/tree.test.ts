import { findInTree } from '../tree'

describe('findInTree', () => {
  it('should find node', () => {
    const tree = [
      {
        id: '1',
        name: 'root',
        children: [
          {
            id: '2',
            name: 'child1',
            children: [
              {
                id: '3',
                name: 'child2',
                children: [
                  {
                    id: '4',
                    name: 'child3',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: '5',
        name: 'root2',
        children: [
          {
            id: '6',
            name: 'child1',
            children: [],
          },
        ],
      },
    ]

    expect(findInTree(tree, '4')).toEqual(tree[0].children[0].children[0].children[0])
    expect(findInTree(tree, '6')).toEqual(tree[1].children[0])
  })
})

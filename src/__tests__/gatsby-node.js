const { onCreateNode } = require('../gatsby-node')

// Copied from
// https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-toml
describe('Process TOML nodes correctly', () => {
  const node = {
    id: 'whatever',
    parent: null,
    children: [],
    extension: 'toml',
    internal: {
      contentDigest: 'whatever',
    },
    name: 'test',
  }

  // Provide fake functions
  const loadNodeContent = node => Promise.resolve(node.content)

  it('Correctly creates nodes from TOML test file', async () => {
    node.content = `
    title = "a title"
    date = 2019-07-20
    notes = ['A', 'C', 'C', 'E', 'B']

    [[editors]]
    name = "Alice"
    url = "~alicewonder"

    [[editors]]
    name = "Bob"
    url = "~bobsponge"
    `

    const createNode = jest.fn()
    const createParentChildLink = jest.fn()
    const actions = { createNode, createParentChildLink }
    const createNodeId = jest.fn()
    createNodeId.mockReturnValue('uuid-from-gatsby')
    const createContentDigest = jest.fn().mockReturnValue('contentDigest')

    await onCreateNode({
      node,
      loadNodeContent,
      actions,
      createNodeId,
      createContentDigest,
    }).then(() => {
      expect(createNode.mock.calls).toMatchSnapshot()
      expect(createParentChildLink.mock.calls).toMatchSnapshot()
      expect(createNode).toHaveBeenCalledTimes(1)
      expect(createParentChildLink).toHaveBeenCalledTimes(1)
      expect(createContentDigest).toHaveBeenCalledTimes(1)
    })
  })
})

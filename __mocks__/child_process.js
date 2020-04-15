export const spawn = jest.fn()
export const spawnSync = jest.fn().mockReturnValue({ status: 0 })

export default { spawn, spawnSync }

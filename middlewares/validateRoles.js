
export const isAdminRol = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: 'Se quiere verificar un rol sin haber validado el token.'
    })
  }

  const { rol, name } = req.user

  if (rol !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${name} no esta autorizado para realizar esta accion.`
    })
  }

  next()
}

export const haveRol = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'Se quiere verificar un rol sin haber validado el token.'
      })
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(401).json({
        msg: `Rol no valido. Se requiere alguno de los siguientes: ${roles}`
      })
    }

    next()
  }
}

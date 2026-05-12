const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UsuarioController {
    async listar(req, res) {
        try {
            const { condominioId } = req.query;
            const filter = condominioId ? { condominioId: Number(condominioId) } : {};
            
            const usuarios = await prisma.usuario.findMany({
                where: filter,
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    role: true,
                    status: true,
                    condominio: { select: { nome: true } }
                }
            });
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async criar(req, res) {
        try {
            const { nome, email, senha, role, condominioId } = req.body;
            const usuario = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha, // Em produção, usar bcrypt
                    role,
                    condominioId: condominioId ? Number(condominioId) : null
                }
            });
            res.status(201).json(usuario);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const usuario = await prisma.usuario.update({
                where: { id: Number(id) },
                data: { status }
            });
            res.json(usuario);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioController();
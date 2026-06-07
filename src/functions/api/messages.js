export async function onRequestGet(context) {
    try {
        const result = await context.env.DB.prepare(
            'SELECT id, nickname, message, created_at FROM messages ORDER BY created_at DESC'
        ).all();

        return new Response(JSON.stringify({
            success: true,
            data: result.results
        }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: '获取失败: ' + error.message
        }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function onRequestDelete(context) {
    try {
        const url = new URL(context.request.url);
        const id = url.searchParams.get('id');

        if (!id || isNaN(id)) {
            return new Response(JSON.stringify({
                success: false,
                message: '无效的ID'
            }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const result = await context.env.DB.prepare(
            'DELETE FROM messages WHERE id = ?'
        ).bind(id).run();

        if (result.meta.changes === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: '留言不存在'
            }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: '删除成功'
        }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: '删除失败: ' + error.message
        }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

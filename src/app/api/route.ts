export const dynamic = 'force-static';

export async function GET() {
    const data = [
        {
            id: 1,
            name: 'Tran Dung',
        },
    ];
    return Response.json({ data });
}

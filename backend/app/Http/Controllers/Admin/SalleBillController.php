<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SalleBill;
use PDF;

class SalleBillController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        try {
            $salleBill = SalleBill::latest()->get();
            return response()->json([
                'success' => true,
                'message' => 'Database connection successful!',
                'data' => $salleBill
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Database connection failed!',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        foreach ($request->data as $key => $id) {
            $salleBill = SalleBill::find($id);

            if($salleBill->status == 1){
                $salleBillDetails = \App\Models\SalleBillDetail::where('saleid', $id)->get();
        
                foreach ($salleBillDetails as $salleBillDetail) {
                    $product = \App\Models\Product::where('name', $salleBillDetail->name_product)->first();
        
                    if ($product) {
                        if ($request->action === 'confirm') {
        
                            $productDetails = json_decode($product->product_detail, true);
        
                            foreach ($productDetails as &$detail) {
                                if ($detail['color'] === $salleBillDetail->color && $detail['size'] === $salleBillDetail->size) {
                                    $detail['quantity'] -= $salleBillDetail->quantity;
                                }
                            }
        
                            $product->product_detail = json_encode($productDetails);
                            $product->save();
                        }
                    }
                    elseif($request->action === 'cancel'){
                        $productDetails = json_decode($product->product_detail, true);
    
                        foreach ($productDetails as &$detail) {
                            if ($detail['color'] === $salleBillDetail->color && $detail['size'] === $salleBillDetail->size) {
                                $detail['quantity'] += $salleBillDetail->quantity;
                            }
                        }
    
                        $product->product_detail = json_encode($productDetails);
                        $product->save();
                    }
                }
            }

            if($salleBill->status == 2){
                $salleBillDetails = \App\Models\SalleBillDetail::where('saleid', $id)->get();
        
                foreach ($salleBillDetails as $salleBillDetail) {
                    $product = \App\Models\Product::where('name', $salleBillDetail->name_product)->first();
        
                    if ($product) {
                        if($request->action === 'cancel'){
                            $productDetails = json_decode($product->product_detail, true);
        
                            foreach ($productDetails as &$detail) {
                                if ($detail['color'] === $salleBillDetail->color && $detail['size'] === $salleBillDetail->size) {
                                    $detail['quantity'] += $salleBillDetail->quantity;
                                }
                            }
        
                            $product->product_detail = json_encode($productDetails);
                            $product->save();
                        }
                    }
                }
            }

            if ($request->action === 'confirm') {
                $salleBill->update([
                    'status' => 2,
                ]);
            }
            elseif ($request->action === 'cancel') {
                $salleBill->update([
                    'status' => 4,
                ]);
            }
            elseif ($request->action === 'delete') {
                $salleBill->delete();
            }

        };

        $salleBill = SalleBill::latest()->get();
        return response()->json([
            'success' => true,
            'message' => 'Database connection successful!',
            'data' => $salleBill
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $salleBill = SalleBill::find($id);
        $salleBillDetail = \App\Models\SalleBillDetail::where('saleid', $salleBill->id)->get();
        return response()->json([
            'success' => true,
            'message' => 'Database connection successful!',
            'data' => ['salleBill' => $salleBill,
                       'salleBillDetail' => $salleBillDetail]
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $salleBill = SalleBill::find($id);

        $salleBill->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Database connection successful!',
            'data' => $salleBill
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function printSalleBill(Request $request){
        // Lấy thông tin các đơn hàng từ cơ sở dữ liệu
        $orders = SalleBill::whereIn('id', $request->data)->get();
        $orderDetails = \App\Models\SalleBillDetail::whereIn('saleid', $request->data)->get();

        // Tạo HTML từ thông tin đơn hàng
        $html = $this->generateHtmlForPdf($orders, $orderDetails);

        // Tạo Dompdf instance và load HTML
        $pdf = \App::make('dompdf.wrapper');
        $pdf->loadHTML($html);

        // Stream PDF tới trình duyệt
        return $pdf->stream();
    }

    private function generateHtmlForPdf($orders, $orderDetails) {
        $html = '<html><head><style>
                    body { font-family: DejaVu Sans; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid black; padding: 5px; }
                    th { background-color: #f2f2f2; }
                    .page-break { page-break-before: always; }
                </style></head><body>';
    
        foreach ($orders as $order) {
            $status = $this->getStatusText($order->status);
            $html .= '<div class="page-break">';
            $html .= '<h4> Name:'. htmlspecialchars($order->fullname) .'</h4>';
            $html .= '<h4> Email:'. htmlspecialchars($order->email) .'</h4>';
            $html .= '<h4> Phone:'. htmlspecialchars($order->phone) .'</h4>';
            $html .= '<h4> Địa điểm:'. htmlspecialchars($order->address . ' - ' . $order->district . ' - ' . $order->province) .'</h4>';
            $html .= '<h4> Ngày mua:'. htmlspecialchars($order->created_at) .'</h4>';
            $html .= '<h4> Total:'. htmlspecialchars(number_format($order->moneytotal) . '$') .'</h4>';
            $html .= '<h4> Pay:'. htmlspecialchars($order->pay) .'</h4>';  
            $html .= '<table>';
            $html .= '<thead><tr>
                        <th>Name Product</th>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr></thead>';
            $html .= '<tbody>';
            foreach ($orderDetails as $detail) {
                if($detail->saleid == $order->id){
                    $html .= '<tr>
                                <td>' . htmlspecialchars($detail->name_product) . '</td>
                                <td>' . htmlspecialchars($detail->size) . '</td>
                                <td>' . htmlspecialchars($detail->color) . '</td>
                                <td>' . htmlspecialchars($detail->quantity) . '</td>
                                <td>' . htmlspecialchars(number_format($detail->discount) . '$') . '</td>
                                <td>' . htmlspecialchars(number_format($detail->total) . '$') . '</td>';
                    }
                }
            $html .= '</tr></tbody></table></div>';
        }
    
        $html .= '</body></html>';
        return $html;
    }
       
    private function getStatusText($status) {
        switch ($status) {
            case 1:
                return 'Chờ xử lý';
            case 2:
                return 'Đang vận chuyển';
            case 3:
                return 'Đã hoàn thành';
            case 4:
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    }
}

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VideoController;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/videos', [VideoController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/videos', [VideoController::class, 'store']);
    Route::delete('/videos/{video}', [VideoController::class, 'destroy']);
});

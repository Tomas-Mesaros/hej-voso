<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Models\Artist;

Route::get('/artists-test', function () {
    $artists = Artist::all();
    return response()->json($artists);
});

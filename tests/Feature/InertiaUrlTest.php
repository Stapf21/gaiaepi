<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InertiaUrlTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_inertia_response_contains_url(): void
    {
        $user = User::factory()->create();

        $version = \Inertia\Inertia::getVersion();

        $headers = [
            'X-Inertia' => 'true',
            'X-Requested-With' => 'XMLHttpRequest',
        ];

        if ($version !== null) {
            $headers['X-Inertia-Version'] = $version;
        }

        $response = $this->actingAs($user)
            ->withHeaders($headers)
            ->get('/dashboard');

        if ($response->getStatusCode() === 409) {
            $response->assertStatus(409);
            $this->assertTrue($response->headers->has('X-Inertia-Location'));
            $this->assertSame(url('/dashboard'), $response->headers->get('X-Inertia-Location'));

            return;
        }

        $response->assertOk();

        $this->assertIsString($response->json('url'));
        $this->assertNotSame('', $response->json('url'));
    }
}

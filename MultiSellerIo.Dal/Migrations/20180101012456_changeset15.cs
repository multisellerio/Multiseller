using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace MultiSellerIo.Dal.Migrations
{
    public partial class changeset15 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CountryId",
                table: "ShippingCosts",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShippingCosts_CountryId",
                table: "ShippingCosts",
                column: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShippingCosts_Countries_CountryId",
                table: "ShippingCosts",
                column: "CountryId",
                principalTable: "Countries",
                principalColumn: "CountryId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShippingCosts_Countries_CountryId",
                table: "ShippingCosts");

            migrationBuilder.DropIndex(
                name: "IX_ShippingCosts_CountryId",
                table: "ShippingCosts");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "ShippingCosts");
        }
    }
}
